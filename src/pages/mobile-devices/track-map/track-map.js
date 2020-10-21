import React, { useCallback, useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

import appConstants from '../../../constants/app-constants'
import TrackMapCallout from './track-map-callout';
import { getLocationRecordsByRangeAsync } from '../../../api/mobile-devices';
import './track-map.scss';
import CheckBox from 'devextreme-react/ui/check-box';
import { useScreenSize } from '../../../utils/media-query';
import Geocode from '../../../api/geocode';
import TrackMapInfoBox from './track-map-info-box';

const TrackMap = ({ mobileDevice, timelineItem }) => {

    const [locationRecords, setLocationRecords] = useState(null);
    let mapInstance = null, currentInfoWindow = null, trackPath = null, currentMarkers = [];
    const { isXSmall } = useScreenSize();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBLE0ThOFO5aYYVrsDP8AIJUAVDCiTPiLQ'
    })

    useEffect(() => {
        ( async () => {
            const locationRecordsData = await getLocationRecordsByRangeAsync(
                mobileDevice.id,
                Date.parse(timelineItem.beginDate),
                Date.parse(timelineItem.endDate)
            );
            setLocationRecords(locationRecordsData);
        } )()
    }, [mobileDevice.id, timelineItem]);

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


    const fetchAddressAsync = async (location) => {
        const geocodeResponse = await Geocode.fromLatLng(location.latitude, location.longitude);
        if (geocodeResponse && geocodeResponse.status === 'OK') {
            return geocodeResponse.results.find((e, i) => i === 0).formatted_address;
        }
        return null;
    };

    const showInfoWindowAsync = async locationRecord => {
        if (mapInstance) {
            if (currentInfoWindow !== null) {
                currentInfoWindow.close();
            }

            const address = await fetchAddressAsync(locationRecord);

            const content = ReactDOMServer.renderToString(
                React.createElement(
                    TrackMapCallout,
                    { locationRecord: locationRecord, address: address }
                )
            );
            currentInfoWindow = new window.google.maps.InfoWindow({
                position: {
                    lat: locationRecord.latitude,
                    lng: locationRecord.longitude
                },
                content: content
            });
            mapInstance.setCenter({
                lat: locationRecord.latitude,
                lng: locationRecord.longitude
            });
            const currentZoom = mapInstance.getZoom();
            if (currentZoom <= 15) {
                mapInstance.setZoom(15);
            }
            currentInfoWindow.open(mapInstance);
        }
    };

    const showTrackPath = () => {
        if (trackPath === null) {
            trackPath = new window.google.maps.Polyline({
                path: locationRecords.map(locationRecord => {
                    return {
                        lat: locationRecord.latitude,
                        lng: locationRecord.longitude
                    }
                }),
                geodesic: true,
                icons: [
                    {
                        icon: {
                            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            scale: 3,
                            fillOpacity: 1,
                            strokeWeight: 0.8,
                            fillColor: '#FF5722',
                            strokeColor: '#FF5722',
                        }, repeat: '5%'
                    }
                ],
                strokeColor: '#FF5722',
                strokeOpacity: .7,
                strokeWeight: 8,
            });
            trackPath.setMap(mapInstance);
        }
    };

    const showLocationMarkers = () => {

        locationRecords.forEach((locationRecord) => {
            const marker = new window.google.maps.Marker(
                {
                    position: {
                        lat: locationRecord.latitude,
                        lng: locationRecord.longitude
                    },
                    icon: {
                        path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                        scale: 3,
                        fillOpacity: 1,
                        strokeWeight: 0.8,
                        fillColor: '#FF5722',
                        strokeColor: 'black',
                        rotation: locationRecord.heading
                    }
                });
            marker.addListener('click', async () => {
                await showInfoWindowAsync(locationRecord);
            });
            marker.setMap(mapInstance);
            currentMarkers.push(marker);
        });
    };

    return ( isLoaded && locationRecords !== null ?
            <React.Fragment>
                <CheckBox className={ 'track-map-check-box' } text={ 'Показывать маркерами геолокации' } onValueChanged={ (e) => {
                    if (e.value === true) {
                        trackPath.setMap(null);
                        trackPath = null;
                        showLocationMarkers();
                    } else {
                        currentMarkers.forEach(m => {
                            m.setMap(null);
                        });
                        currentMarkers = [];
                        showTrackPath();
                    }
                } }/>

                <GoogleMap
                    zoom={ 15 }
                    mapTypeId={ window.google.maps.MapTypeId.ROADMAP }
                    options={ {
                        styles: [{ featureType: 'all', stylers: [{ saturation: 2.5 }, { gamma: 0.25 }] }]
                    } }
                    center={ { lng: 49.156374, lat: 55.796685 } }
                    mapContainerStyle={ { height: (isXSmall ? '80%' : '90%'), width: '100%' } }
                    onLoad={ (googleMap) => {
                        mapInstance = googleMap;
                        fitMapBoundsByLocations(googleMap, locationRecords);
                        showTrackPath();
                    } }
                    onRightClick={ () => {
                        fitMapBoundsByLocations(mapInstance, locationRecords);
                    } }
                >
                    { isXSmall ? null :
                        <TrackMapInfoBox mobileDevice={ mobileDevice } timelineItem={ timelineItem }/>
                    }
                </GoogleMap>
            </React.Fragment>
            : <div className={ 'dx-datagrid-nodata nodata' }>{ appConstants.noDataLongText }</div>
    );
};
export default TrackMap;
