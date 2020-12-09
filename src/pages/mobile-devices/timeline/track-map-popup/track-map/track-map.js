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
import AppConstants from '../../../../../constants/app-constants';
import './track-map.scss';

const TrackMap = ({ mobileDevice, timelineItem, refreshToken }) => {
    const { appSettingsData, getDailyTimelineItem } = useAppSettings();
    const { isXSmall, isSmall } = useScreenSize();

    const { getLocationRecordsByRangeAsync } = useAppData();

    const [locationRecords, setLocationRecords] = useState(null);
    const [currentTimelineItem, setCurrentTimelineItem] = useState({ ...timelineItem });

    const prevWorkDate = useRef(appSettingsData.workDate);

    useEffect(() => {
        if(prevWorkDate.current !== appSettingsData.workDate) {
            setCurrentTimelineItem(getDailyTimelineItem());
        }
    }, [appSettingsData.workDate, getDailyTimelineItem])


    const mapInstance = useRef(null);
    const trackPath = useRef(null);
    const currentMarkers = useRef([]);
    const currentBreakIntervals = useRef([]);
    const currentInfoWindow = useRef(null);
    const currentBoundBox = useRef(null);
    const currentStationaryCircle = useRef(null);

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

        if (currentInfoWindow.current) {
            const currentZoom = mapInstance.current.getZoom();
            if (currentZoom <= AppConstants.trackMap.defaultZoom) {
                mapInstance.current.setZoom(AppConstants.trackMap.defaultZoom);
            }
            mapInstance.current.setCenter(currentInfoWindow.current.getPosition());
            return;
        }
        if (currentStationaryCircle.current) {
            map.setCenter(currentStationaryCircle.current.getCenter());
            mapInstance.current.fitBounds(currentStationaryCircle.current.getBounds());
            return;
        }
        if (locationList && locationList.length > 0) {
            const boundBox = getBoundsByMarkers(locationList);
            if (boundBox) {
                map.setCenter(boundBox.getCenter());
                map.fitBounds(boundBox);
            }
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
                content: content,
            });
            currentInfoWindow.current.addListener('closeclick', () => {
                currentInfoWindow.current = null;
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
        currentMarkers.current = [];

        currentBreakIntervals.current.forEach(bi => {
            bi.setMap(null);
            bi = null;
        });

        if (currentStationaryCircle.current) {
            currentStationaryCircle.current.setMap(null);
            currentStationaryCircle.current = null;
        }
        if (currentInfoWindow.current) {
            currentInfoWindow.current.setMap(null);
            currentInfoWindow.current = null;
        }
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

    const showTrack = useCallback(() => {
        initOverlays();
        fitMapBoundsByLocations(mapInstance.current, locationRecords);
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
    }, [initOverlays, fitMapBoundsByLocations, locationRecords, buildMarkersOnPolylinePath, buildOutsideMarkers, appSettingsData.isShownBreakInterval, buildBreakIntervals]);

    useEffect(() => {
        ( async () => {
            let locationRecordsData = await getLocationRecordsByRangeAsync(
                mobileDevice.id,
                currentTimelineItem.beginDate,
                currentTimelineItem.endDate
            ) ?? [];
            setLocationRecords(locationRecordsData);
        } )()
    }, [getLocationRecordsByRangeAsync, mobileDevice.id, currentTimelineItem, appSettingsData.minimalAccuracy, refreshToken]);

    useEffect(() => {
        if (mapInstance.current) {
            showTrack();
        }
    }, [locationRecords, showTrack]);

    return ( isLoaded && locationRecords !== null ?
            <>
                <TrackMapHeader
                    mobileDevice={ mobileDevice }
                    timelineItem={ currentTimelineItem }
                    onCurrentTimelineItemChanged={ (currentTimelineItem) => {
                        if(currentTimelineItem) {
                            setCurrentTimelineItem(currentTimelineItem);
                        }
                    } }
                />
                <GoogleMap
                    zoom={ AppConstants.trackMap.defaultZoom }
                    mapTypeId={ window.google.maps.MapTypeId.ROADMAP }
                    options={
                        {
                            mapTypeControl: !( isXSmall || isSmall ),
                            scaleControl: !isXSmall,
                            zoomControl: !( isXSmall || isSmall ),
                            styles: AppConstants.trackMap.defaultTheme
                        } }
                    center={ AppConstants.trackMap.defaultCenter }
                    mapContainerStyle={ { height: '90%', width: '100%' } }
                    onLoad={ (googleMap) => {
                        mapInstance.current = googleMap;
                        const delayTimer = setTimeout(() => {
                            showTrack();
                            clearTimeout(delayTimer);
                        }, 250);
                    } }
                    onClick={ () => {
                        if (currentInfoWindow.current !== null) {
                            currentInfoWindow.current.close();
                            currentInfoWindow.current = null;
                        }
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
            <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
    );
};
export default TrackMap;
