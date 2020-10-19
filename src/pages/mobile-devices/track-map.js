import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

import appConstants from '../../constants/app-constants'
import { getLocationRecordsByRangeAsync } from '../../api/mobile-devices';
import './track-map.scss';

const TrackMap = ({ timeline, currentMobileDevice }) => {

    const [locations, setLocations] = useState(null);
    const [mapInstance, setMapInstance] = useState(null);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBLE0ThOFO5aYYVrsDP8AIJUAVDCiTPiLQ'
    })

    useEffect(() => {
        ( async () => {
            const locationData = await getLocationRecordsByRangeAsync(
                currentMobileDevice.id,
                Date.parse(timeline.beginDate),
                Date.parse(timeline.endDate)
            );
            setLocations(locationData);
        } )()
    }, [currentMobileDevice.id, timeline]);

    const getBoundsByMarkers = useCallback((locationList) => {
        const boundBox = new window.google.maps.LatLngBounds();
        for (let i = 0; i < locationList.length; i++) {
            boundBox.extend({
                lat: locationList[i].latitude,
                lng: locationList[i].longitude
            });
        }
        return boundBox;
    }, []);

    const fitMapBoundsByLocations = useCallback((map, locationList) => {
        if (locationList && locationList.length > 0) {
            const boundBox = getBoundsByMarkers(locationList);
            map.setCenter(boundBox.getCenter());
            map.fitBounds(boundBox);
        }
    }, [getBoundsByMarkers]);

    return ( isLoaded && locations !== null ?
            <React.Fragment>
                <GoogleMap
                    zoom={ 15 }
                    mapTypeId={ window.google.maps.MapTypeId.ROADMAP }
                    options={ {
                        styles: [{ featureType: 'all', stylers: [{ saturation: 2.5 }, { gamma: 0.25 }] }]
                    } }
                    center={ { lng: 49.156374, lat: 55.796685 } }
                    mapContainerStyle={ { height: 400 } }
                    onLoad={ (map) => {
                        setMapInstance(map);
                        fitMapBoundsByLocations(map, locations);
                    } }
                    onRightClick={ () => {
                        fitMapBoundsByLocations(mapInstance, locations);
                    } }
                >
                    {
                        locations.map((location, i) =>
                            <Marker key={ i } position={ {
                                lat: location.latitude,
                                lng: location.longitude
                            } }
                                    icon={ {
                                        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                                        scale: 2,
                                        fillOpacity: 1,
                                        strokeWeight: 0.8,
                                        fillColor: '#FF5722',
                                        strokeColor: 'black',
                                        rotation: location.heading
                                    } }
                                    onClick={ (e) => {
                                        console.log(e);
                                    } }
                            />
                        )
                    }
                </GoogleMap>
            </React.Fragment>
            : <div className={ 'dx-datagrid-nodata nodata' }>{ appConstants.noDataLongText }</div>
    );
};
export default TrackMap;
