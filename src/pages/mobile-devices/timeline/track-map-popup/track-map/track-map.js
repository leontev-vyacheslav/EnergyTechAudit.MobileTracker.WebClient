import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import TrackMapInfoWindow from './track-map-info-window';
import CheckBox from 'devextreme-react/ui/check-box';
import Geocode from '../../../../../api/external/geocode';
import TrackMapInfoBox from './track-map-info-box';
import { useScreenSize } from '../../../../../utils/media-query';
import { useAppData } from '../../../../../contexts/app-data';
import Loader from '../../../../../components/loader/loader';
import AppConstants from '../../../../../constants/app-constants';
import './track-map.scss';

const TrackMap = ({ mobileDevice, timelineItem }) => {

    const [locationRecords, setLocationRecords] = useState(null);

    let mapInstance = null, currentInfoWindow = null, trackPath = null, currentMarkers = [];

    const { isXSmall, isSmall } = useScreenSize();
    const { getLocationRecordsByRangeAsync } = useAppData();
    const [isDelayComplete, setIsDelayComplete] = useState(false);
    setTimeout(() => {
        setIsDelayComplete(true);
    }, AppConstants.loadingDelay);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBLE0ThOFO5aYYVrsDP8AIJUAVDCiTPiLQ'
    })

    useEffect(() => {
        ( async () => {
            let locationRecordsData = await getLocationRecordsByRangeAsync(
                mobileDevice.id,
                Date.parse(timelineItem.beginDate),
                Date.parse(timelineItem.endDate)
            );
            if (locationRecordsData) {
                locationRecordsData = locationRecordsData.filter(l => l.accuracy <= 100);
            }
            setLocationRecords(locationRecordsData);
        } )()
    }, [getLocationRecordsByRangeAsync, mobileDevice.id, timelineItem]);

    const getBoundsByMarkers = (locationList) => {
        const boundBox = new window.google.maps.LatLngBounds();
        for (let i = 0; i < locationList.length; i++) {
            boundBox.extend({
                lat: locationList[i].latitude,
                lng: locationList[i].longitude
            });
        }
        return boundBox;
    };

    const fitMapBoundsByLocations = (map, locationList) => {
        if (locationList && locationList.length > 0) {
            const boundBox = getBoundsByMarkers(locationList);
            map.setCenter(boundBox.getCenter());
            map.fitBounds(boundBox);
        }
    };

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
                    TrackMapInfoWindow,
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

    const initOverlays = () => {
        if (trackPath !== null) {
            trackPath.setMap(null);
            trackPath = null;
        }
        currentMarkers.forEach(m => {
            m.setMap(null);
        });
        currentMarkers = [];
    };

    const buildMarker = (locationRecord, mode, order) => {
        const marker = new window.google.maps.Marker(
            {
                position: {
                    lat: locationRecord.latitude,
                    lng: locationRecord.longitude
                },
                label: mode === 'track' ? {
                    text: `${ order }`,
                    fontSize: '11px',
                    color: 'darkblue',
                    fontWeight: '600'
                } : null,
                icon: {
                    labelOrigin: { x: -3, y: -1 },
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
    };

    const buildOutsideMarkers = () => {
        const firstMarker = new window.google.maps.Marker({
            position: {
                lat: locationRecords[0].latitude,
                lng: locationRecords[0].longitude
            },
            map: mapInstance,
            label: {text: 'A'}
        });
        firstMarker.addListener('click', async () => {
            await showInfoWindowAsync(locationRecords[0]);
        });
        currentMarkers.unshift(firstMarker);
        const lastMarker = new window.google.maps.Marker({
            position: {
                lat: locationRecords[locationRecords.length - 1].latitude,
                lng: locationRecords[locationRecords.length - 1].longitude
            },
            map: mapInstance,
            label: { text: 'B' }
        });
        lastMarker.addListener('click', async () => {
            await showInfoWindowAsync(locationRecords[locationRecords.length - 1]);
        });
        currentMarkers.push(lastMarker);
    };

    const showTrackPath = () => {
        initOverlays();
        if (trackPath === null) {
            trackPath = new window.google.maps.Polyline({
                path: locationRecords.map(locationRecord => {
                    return {
                        lat: locationRecord.latitude,
                        lng: locationRecord.longitude
                    }
                }),
                geodesic: true,
                strokeColor: '#FF5722',
                strokeOpacity: .7,
                strokeWeight: 8,
            });
            trackPath.setMap(mapInstance);

            let p = 1;
            if (locationRecords.length <= 10) {
                p = 1; // 100 %
            } else if (locationRecords.length <= 100) {
                p = 5; // 20 %
            } else if (locationRecords.length <= 1000) {
                p = 10; // 10 %
            } else if (( locationRecords.length <= 10000 )) {
                p = 20 // 5 %
            } else {
                p = 50 // 2 %
            }
            locationRecords
                .filter((_, i) => i % p === 0)
                .concat(locationRecords[locationRecords.length - 1])
                .forEach((locationRecord, i) => {
                    buildMarker(locationRecord, 'track', i + 1);
                });

            buildOutsideMarkers();
        }
    };

    const showLocationMarkers = () => {
        initOverlays();
        locationRecords.forEach((locationRecord, i) => {
            buildMarker(locationRecord, 'onlyMarkers', i + 1)
        });
        buildOutsideMarkers();
    };

    return ( isLoaded && locationRecords !== null && isDelayComplete ?
            <>
                { isXSmall || isSmall
                    ? null
                    : <CheckBox className={ 'track-map-check-box' } text={ 'Показывать маркерами геолокации' } onValueChanged={ (e) => {
                        if (e.value === true) {
                            showLocationMarkers();
                        } else {
                            showTrackPath();
                        }
                    } }/>
                }
                <GoogleMap
                    zoom={ 15 }
                    mapTypeId={ window.google.maps.MapTypeId.ROADMAP }
                    options={ {
                        styles: [{ featureType: 'all', stylers: [{ saturation: 2.5 }, { gamma: 0.25 }] }]
                    } }
                    center={ { lng: 49.156374, lat: 55.796685 } }
                    mapContainerStyle={ { height: ( isXSmall || isSmall  ? '100%' : '90%' ), width: '100%' } }

                    onLoad={ (googleMap) => {
                        mapInstance = googleMap;

                        setTimeout(() => {
                            showTrackPath();
                            fitMapBoundsByLocations(googleMap, locationRecords);
                        }, 250);
                    } }
                    onRightClick={ () => {
                        fitMapBoundsByLocations(mapInstance, locationRecords);
                    } }
                >
                    { isXSmall || isSmall ? null :
                        <TrackMapInfoBox mobileDevice={ mobileDevice } timelineItem={ timelineItem }/>
                    }
                </GoogleMap>
            </>
            :
            <Loader/>
    );
};
export default TrackMap;
