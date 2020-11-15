import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import Geocode from '../../../../../api/external/geocode';
import TrackMapInfoWindow from './track-map-info-window';
import TrackMapInfoBox from './track-map-info-box';
import TrackMapHeader from './track-map-header';
import { useScreenSize } from '../../../../../utils/media-query';
import { useAppData } from '../../../../../contexts/app-data';
import { useAppSettings } from '../../../../../contexts/app-settings';
import Loader from '../../../../../components/loader/loader';
import AppConstants from '../../../../../constants/app-constants';
import './track-map.scss';

const libraries = ['geometry'];

const TrackMap = ({ mobileDevice, timelineItem, timeline }) => {
    const { appSettingsData } = useAppSettings();
    const { getTimelinesAsync } = useAppData();
    const [currentTimeline, setCurrentTimeline] = useState(timeline);
    const [locationRecords, setLocationRecords] = useState(null);
    const [currentTimelineItem, setCurrentTimelineItem] = useState(timelineItem);
    const [isShownTrackByMarkers, setIsShownTrackByMarkers] = useState(false);

    useEffect(() => {
        const beginDate = new Date(appSettingsData.workDate);
        const endDate = new Date(appSettingsData.workDate);
        endDate.setHours(24);
        const timelineItem = { id: 0, beginDate: beginDate.toISOString(), endDate: endDate.toISOString() };
        if (!timeline) {
            ( async () => {
                let timeline = await getTimelinesAsync(mobileDevice.id, appSettingsData.workDate);
                setCurrentTimeline([timelineItem, ...timeline]);
            } )();
        } else {
            setCurrentTimeline(previousCurrentTimeline => [timelineItem, ...previousCurrentTimeline]);
        }
    }, [getTimelinesAsync, appSettingsData.workDate, mobileDevice.id, timeline]);

    const mapInstance = useRef(null);
    const trackPath = useRef(null);
    const currentMarkers = useRef([]);
    const currentBreakIntervals = useRef([]);
    const currentInfoWindow = useRef(null);

    const { isXSmall, isSmall } = useScreenSize();
    const { getLocationRecordsByRangeAsync } = useAppData();
    const [isDelayComplete, setIsDelayComplete] = useState(false);

    setTimeout(() => {
        setIsDelayComplete(true);
    }, AppConstants.loadingDelay);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyBLE0ThOFO5aYYVrsDP8AIJUAVDCiTPiLQ',
        libraries: libraries
    });

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

    const fetchAddressAsync = useCallback(async (location) => {
        const geocodeResponse = await Geocode.fromLatLng(location.latitude, location.longitude);
        if (geocodeResponse && geocodeResponse.status === 'OK') {
            return geocodeResponse.results.find((e, i) => i === 0).formatted_address;
        }
        return null;
    }, []);

    const showInfoWindowAsync = useCallback(async locationRecord => {
        if (mapInstance.current) {
            if (currentInfoWindow.current !== null) {
                currentInfoWindow.current.close();
            }
            const address = await fetchAddressAsync(locationRecord);

            const content = ReactDOMServer.renderToString(
                React.createElement(
                    TrackMapInfoWindow,
                    { locationRecord: locationRecord, address: address }
                )
            );
            currentInfoWindow.current = new window.google.maps.InfoWindow({
                position: {
                    lat: locationRecord.latitude,
                    lng: locationRecord.longitude
                },
                content: content
            });
            mapInstance.current.setCenter({
                lat: locationRecord.latitude,
                lng: locationRecord.longitude
            });
            const currentZoom = mapInstance.current.getZoom();
            if (currentZoom <= 15) {
                mapInstance.current.setZoom(15);
            }
            currentInfoWindow.current.open(mapInstance.current);
        }
    }, [fetchAddressAsync]);

    const initOverlays = useCallback(() => {
        if (trackPath.current !== null) {
            trackPath.current.setMap(null);
            trackPath.current = null;
        }
        currentMarkers.current.forEach(m => {
            m.setMap(null);
            m = null;
        });
        currentBreakIntervals.current.forEach( bi => {
          bi.setMap(null);
          bi = null;
        });

        currentMarkers.current = [];
    }, []);

    const buildMarker = useCallback((locationRecord, mode, order) => {
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
        marker.setMap(mapInstance.current);
        currentMarkers.current.push(marker);
    }, [showInfoWindowAsync]);

    const buildOutsideMarkers = useCallback(() => {
        const firstMarker = new window.google.maps.Marker({
            position: {
                lat: locationRecords[0].latitude,
                lng: locationRecords[0].longitude
            },
            map: mapInstance.current,
            label: { text: 'A' }
        });
        firstMarker.addListener('click', async () => {
            await showInfoWindowAsync(locationRecords[0]);
        });
        currentMarkers.current.unshift(firstMarker);
        const lastMarker = new window.google.maps.Marker({
            position: {
                lat: locationRecords[locationRecords.length - 1].latitude,
                lng: locationRecords[locationRecords.length - 1].longitude
            },
            map: mapInstance.current,
            label: { text: 'B' }
        });
        lastMarker.addListener('click', async () => {
            await showInfoWindowAsync(locationRecords[locationRecords.length - 1]);
        });
        currentMarkers.current.push(lastMarker);
    }, [locationRecords, showInfoWindowAsync]);

    const buildBreakIntervals = useCallback(() => {
        for (let i = 0; i < locationRecords.length - 1; i++) {

            const currentLocation = new window.google.maps.LatLng({
                lat: locationRecords[i].latitude,
                lng: locationRecords[i].longitude
            }), nextLocation = new window.google.maps.LatLng({
                lat: locationRecords[i + 1].latitude,
                lng: locationRecords[i + 1].longitude
            });

            const distance = window.google.maps.geometry.spherical.computeDistanceBetween(currentLocation, nextLocation);
            if (distance >= appSettingsData.breakInterval) {
                const breakIntervalPath = new window.google.maps.Polyline({
                    path: [currentLocation, nextLocation],
                    geodesic: true,
                    strokeColor: AppConstants.colors.companyColor,
                    strokeOpacity: 0.8,
                    strokeWeight: 8,
                });
                breakIntervalPath.setMap(mapInstance.current);
                currentBreakIntervals.current.push(breakIntervalPath);
            }
        }
    }, [appSettingsData.breakInterval, locationRecords]);

    const showTrackByPolylinePath = useCallback(() => {
        initOverlays();

        if (trackPath.current === null && locationRecords && locationRecords.length > 0) {

            trackPath.current = new window.google.maps.Polyline({
                path: locationRecords.map(locationRecord => {
                    return {
                        lat: locationRecord.latitude,
                        lng: locationRecord.longitude
                    }
                }),
                geodesic: true,
                strokeColor: AppConstants.colors.themeBaseAccent,
                strokeOpacity: .7,
                strokeWeight: 8,
            });
            trackPath.current.setMap(mapInstance.current);

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
                .concat(locationRecords.length > 0 ? locationRecords[locationRecords.length - 1] : [])
                .forEach((locationRecord, i) => {
                    buildMarker(locationRecord, 'track', i + 1);
                });

            buildOutsideMarkers();
            if (appSettingsData.isShownBreakInterval) {
                buildBreakIntervals();
            }
        }
    }, [initOverlays, locationRecords, buildOutsideMarkers, appSettingsData.isShownBreakInterval, buildMarker, buildBreakIntervals]);

    const showTrackByMarkers = useCallback(() => {
        initOverlays();
        locationRecords.forEach((locationRecord, i) => {
            buildMarker(locationRecord, 'onlyMarkers', i + 1)
        });
        buildOutsideMarkers();
    }, [initOverlays, locationRecords, buildMarker, buildOutsideMarkers]);

    useEffect(() => {
        ( async () => {
            let locationRecordsData = await getLocationRecordsByRangeAsync(
                mobileDevice.id,
                Date.parse(currentTimelineItem.beginDate),
                Date.parse(currentTimelineItem.endDate)
            );
            if (locationRecordsData) {
                locationRecordsData = locationRecordsData.filter(l => l.accuracy <= appSettingsData.minimalAccuracy);
            }
            setLocationRecords(locationRecordsData);
        } )()
    }, [getLocationRecordsByRangeAsync, mobileDevice.id, currentTimelineItem, appSettingsData.minimalAccuracy]);

    useEffect(() => {
        if (mapInstance.current) {
            console.log(window.google.maps.geometry);
            if(isShownTrackByMarkers)  {
                showTrackByMarkers();
            }
            else {
                showTrackByPolylinePath();
            }
            fitMapBoundsByLocations(mapInstance.current, locationRecords);
        }
    }, [locationRecords, fitMapBoundsByLocations, showTrackByPolylinePath, showTrackByMarkers, isShownTrackByMarkers]);

    return ( isLoaded && locationRecords !== null && isDelayComplete ?
            <>
                { isXSmall || isSmall
                    ? null
                    : <TrackMapHeader
                        timeline={ currentTimeline }
                        currentTimelineItemId={ currentTimelineItem.id }
                        onIntervalChanged={ (e) => {
                            const currentTimelineItem = currentTimeline.find(i => i.id === e.value);
                            setCurrentTimelineItem(currentTimelineItem);
                        } }
                        onTrackTypeChanged={ (e) => {
                            setIsShownTrackByMarkers(e.value);
                        } }/>
                }
                <GoogleMap
                    zoom={ 15 }
                    mapTypeId={ window.google.maps.MapTypeId.ROADMAP }
                    options={ {
                        styles: [{ featureType: 'all', stylers: [{ saturation: 2.5 }, { gamma: 0.25 }] }]
                    } }
                    center={ { lng: 49.156374, lat: 55.796685 } }
                    mapContainerStyle={ { height: ( ( isXSmall || isSmall ) || currentTimeline === null ? '100%' : '90%' ), width: '100%' } }
                    onLoad={ (googleMap) => {
                        mapInstance.current = googleMap;
                        const delayTimer = setTimeout(() => {
                            showTrackByPolylinePath();
                            fitMapBoundsByLocations(mapInstance.current, locationRecords);
                            clearTimeout(delayTimer);
                        }, 250);
                    } }
                    onRightClick={ () => {
                        fitMapBoundsByLocations(mapInstance.current, locationRecords);
                    } }
                >
                    { isXSmall || isSmall ? null :
                        <TrackMapInfoBox mobileDevice={ mobileDevice } timelineItem={ currentTimelineItem }/>
                    }
                </GoogleMap>
            </>
            :
            <Loader/>
    );
};
export default TrackMap;
