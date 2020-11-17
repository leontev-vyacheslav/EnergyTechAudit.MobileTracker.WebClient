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

const TrackMap = ({ mobileDevice, timelineItem, refreshToken }) => {
    const { appSettingsData } = useAppSettings();
    const { getTimelinesAsync } = useAppData();
    const [currentTimeline, setCurrentTimeline] = useState([]);
    const [locationRecords, setLocationRecords] = useState(null);
    const [currentTimelineItem, setCurrentTimelineItem] = useState(timelineItem);
    const [isShownTrackByMarkers, setIsShownTrackByMarkers] = useState(false);

    useEffect(()=>{
        const beginDate = new Date(appSettingsData.workDate);
        const endDate = new Date(appSettingsData.workDate);
        endDate.setHours(24);
        const timelineItem = { id: 0, beginDate: beginDate.toISOString(), endDate: endDate.toISOString() };

        setCurrentTimelineItem(timelineItem);
    }, [appSettingsData.workDate]);

    useEffect(() => {
        const beginDate = new Date(appSettingsData.workDate);
        const endDate = new Date(appSettingsData.workDate);
        endDate.setHours(24);
        const timelineItem = { id: 0, beginDate: beginDate.toISOString(), endDate: endDate.toISOString() };

        ( async () => {
            let timeline = await getTimelinesAsync(mobileDevice.id, appSettingsData.workDate);
            setCurrentTimeline([timelineItem, ...timeline]);
        } )();

        setCurrentTimeline(previousCurrentTimeline => [timelineItem, ...previousCurrentTimeline]);
    }, [getTimelinesAsync, appSettingsData.workDate, mobileDevice.id]);

    const mapInstance = useRef(null);
    const trackPath = useRef(null);
    const currentMarkers = useRef([]);
    const currentBreakIntervals = useRef([]);
    const currentInfoWindow = useRef(null);
    const currentBoundBox = useRef(null);
    const currentStationaryCircle = useRef(null);

    const { isXSmall } = useScreenSize();
    const { getLocationRecordsByRangeAsync } = useAppData();
    const [isDelayComplete, setIsDelayComplete] = useState(false);

    setTimeout(() => {
        setIsDelayComplete(true);
    }, AppConstants.loadingDelay);

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: AppConstants.trackMap.apiKey,
        libraries: AppConstants.trackMap.libraries
    });

    const getBoundsByMarkers = useCallback((locationList) => {
        const boundBox = new window.google.maps.LatLngBounds();
        for (let i = 0; i < locationList.length; i++) {
            boundBox.extend({
                lat: locationList[i].latitude,
                lng: locationList[i].longitude
            });
        }
        currentBoundBox.current = boundBox;
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
            if (currentZoom <= AppConstants.trackMap.defaultZoom) {
                mapInstance.current.setZoom(AppConstants.trackMap.defaultZoom);
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
        currentBreakIntervals.current.forEach(bi => {
            bi.setMap(null);
            bi = null;
        });
        if (currentStationaryCircle.current) {
            currentStationaryCircle.current.setMap(null);
            currentStationaryCircle.current = null;
        }
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
                    fontSize: AppConstants.trackMap.markerLabelFontSize,
                    color: AppConstants.trackMap.markerLabelColor,
                    fontWeight: AppConstants.trackMap.markerLabelFontWeight
                } : null,
                icon: {
                    labelOrigin: { x: -3, y: -1 },
                    path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: AppConstants.trackMap.markerScale,
                    fillOpacity: AppConstants.trackMap.markerFillOpacity,
                    strokeWeight: AppConstants.trackMap.markerStrokeWeight,
                    fillColor: AppConstants.trackMap.markerFillColor,
                    strokeColor: AppConstants.trackMap.markerStrokeColor,
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
                    strokeColor: AppConstants.trackMap.breakIntervalPathStrokeColor,
                    strokeOpacity: AppConstants.trackMap.breakIntervalPathStrokeOpacity,
                    strokeWeight: AppConstants.trackMap.polylineTrackPathStrokeWeight,
                });
                breakIntervalPath.setMap(mapInstance.current);
                currentBreakIntervals.current.push(breakIntervalPath);
            }
        }
    }, [appSettingsData.breakInterval, locationRecords]);

    const buildMarkersOnPolylinePath = useCallback(() => {
        let k = 1;
        let diagonalDistance = 0;
        const boundBox = getBoundsByMarkers(locationRecords);
        if (boundBox) {
            diagonalDistance = window.google.maps.geometry.spherical.computeDistanceBetween(
                boundBox.getNorthEast(),
                boundBox.getSouthWest()
            );
            if (diagonalDistance > 25000) {
                k = 1.5
            }
            if (diagonalDistance > 50000) {
                k = 2
            }
        }
        if (diagonalDistance <= appSettingsData.stationaryRadius) {
            diagonalDistance = diagonalDistance > 100 ? diagonalDistance : 100;
            currentStationaryCircle.current = new window.google.maps.Circle({
                strokeColor: AppConstants.trackMap.stationaryCircleColor,
                strokeOpacity: AppConstants.trackMap.stationaryCircleStrokeOpacity,
                strokeWeight: AppConstants.trackMap.stationaryCircleStrokeWeight,
                fillColor: AppConstants.trackMap.stationaryCircleColor,
                fillOpacity: AppConstants.trackMap.stationaryCircleFillOpacity,
                center: boundBox.getCenter(),
                radius: ( 3 * diagonalDistance ) / 5
            });
            currentStationaryCircle.current.setMap(mapInstance.current);
            mapInstance.current.fitBounds(currentStationaryCircle.current.getBounds());
        }

        let p = 1;
        if (locationRecords.length <= 10) {
            p = 1; // 100 %
        } else if (locationRecords.length <= 100) {
            p = 5; // 20 %
        } else if (locationRecords.length <= 500) {
            p = 10 * k; // 10 %
        } else if (locationRecords.length <= 2500) {
            p = 20 * k; // 5 %
        } else if (( locationRecords.length <= 12500 )) {
            p = 40 * k // 1 %
        } else {
            p = 80 * k // < 1 %
        }
        locationRecords
            .filter((_, i) => i % p === 0)
            .concat(locationRecords.length > 0 ? locationRecords[locationRecords.length - 1] : [])
            .forEach((locationRecord, i) => {
                buildMarker(locationRecord, 'track', i + 1);
            });
    }, [appSettingsData.stationaryRadius, buildMarker, getBoundsByMarkers, locationRecords]);

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
                strokeColor: AppConstants.trackMap.polylineTrackPathStrokeColor,
                strokeOpacity: AppConstants.trackMap.polylineTrackPathStrokeOpacity,
                strokeWeight: AppConstants.trackMap.polylineTrackPathStrokeWeight,
            });
            trackPath.current.setMap(mapInstance.current);
            buildMarkersOnPolylinePath();
            buildOutsideMarkers();
            if (appSettingsData.isShownBreakInterval) {
                buildBreakIntervals();
            }
        }
    }, [initOverlays, locationRecords, appSettingsData.isShownBreakInterval,
        buildOutsideMarkers, buildBreakIntervals, buildMarkersOnPolylinePath
    ]);

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
    }, [getLocationRecordsByRangeAsync, mobileDevice.id, currentTimelineItem, appSettingsData.minimalAccuracy, refreshToken]);

    useEffect(() => {
        if (mapInstance.current) {
            fitMapBoundsByLocations(mapInstance.current, locationRecords);
            if (isShownTrackByMarkers) {
                showTrackByMarkers();
            } else {
                showTrackByPolylinePath();
            }
        }
    }, [locationRecords, fitMapBoundsByLocations, showTrackByPolylinePath, showTrackByMarkers, isShownTrackByMarkers]);

    return ( isLoaded && locationRecords !== null && isDelayComplete ?
            <>
                { isXSmall
                    ? null
                    : <TrackMapHeader
                        timeline={ currentTimeline }
                        currentTimelineItem={ currentTimelineItem }
                        onIntervalChanged={ (e) => {
                            const currentTimelineItem = currentTimeline.find(i => i.id === e.value);
                            setCurrentTimelineItem(currentTimelineItem);
                        } }
                        onTrackTypeChanged={ (e) => {
                            setIsShownTrackByMarkers(e.value);
                        } }/>
                }
                <GoogleMap
                    zoom={ AppConstants.trackMap.defaultZoom }
                    mapTypeId={ window.google.maps.MapTypeId.ROADMAP }
                    options={ {
                        styles: AppConstants.trackMap.defaultTheme
                    } }
                    center={ AppConstants.trackMap.defaultCenter }
                    mapContainerStyle={ { height: ( ( isXSmall ) || currentTimeline === null ? '100%' : '90%' ), width: '100%' } }
                    onLoad={ (googleMap) => {
                        mapInstance.current = googleMap;
                        const delayTimer = setTimeout(() => {
                            fitMapBoundsByLocations(mapInstance.current, locationRecords);
                            showTrackByPolylinePath();
                            clearTimeout(delayTimer);
                        }, 250);
                    } }
                    onRightClick={ () => {
                        fitMapBoundsByLocations(mapInstance.current, locationRecords);
                    } }
                >
                    { isXSmall ? null :
                        <TrackMapInfoBox mobileDevice={ mobileDevice } timelineItem={ currentTimelineItem }/>
                    }
                </GoogleMap>
            </>
            :
            <Loader/>
    );
};
export default TrackMap;
