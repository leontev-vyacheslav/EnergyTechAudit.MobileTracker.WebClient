import React, { useCallback, useEffect,  useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import TrackMapInfoWindow from './track-map-info-window';
import TrackMapInfoBox from './track-map-info-box';
import TrackMapHeader from './track-map-header';
import { useScreenSize } from '../../../../../utils/media-query';
import { useAppData } from '../../../../../contexts/app-data';
import { useAppSettings } from '../../../../../contexts/app-settings';
import AppConstants from '../../../../../constants/app-constants';
import './track-map.scss';
import { useSharedArea } from '../../../../../contexts/shared-area';
import { showStationaryClusters } from './utils/track-map-stationary-zone-builder';
import { buildInfoWindow, centerMapByInfoWindow, fitMapBoundsByLocations, getBoundsByMarkers } from './utils/track-map-utils'

const TrackMap = ({ mobileDevice, timelineItem, initialDate, refreshToken }) => {
    const { isXSmall, isSmall } = useScreenSize();
    const { showLoader, hideLoader } = useSharedArea();
    const { appSettingsData, getDailyTimelineItem } = useAppSettings();
    const { getLocationRecordsByRangeAsync, getLocationRecordAsync, getGeocodedAddressAsync } = useAppData();

    const [trackLocationRecordList, setTrackLocationRecordList] = useState(null);
    const [currentTimelineItem, setCurrentTimelineItem] = useState({ ...timelineItem });

    const prevWorkDate = useRef(!initialDate ? appSettingsData.workDate : initialDate);
    const mapInstance = useRef(null);
    const trackPath = useRef(null);
    const currentMarkers = useRef([]);
    const currentBreakIntervals = useRef([]);
    const currentInfoWindow = useRef(null);
    const stationaryClusters = useRef([]);

    useEffect(() => {
        if (!initialDate) {
            if (prevWorkDate.current !== appSettingsData.workDate) {
                setCurrentTimelineItem(getDailyTimelineItem());
            } else {
                setCurrentTimelineItem(getDailyTimelineItem(initialDate));
            }
        }
    }, [appSettingsData.workDate, getDailyTimelineItem, initialDate])

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: AppConstants.trackMap.apiKey,
        libraries: AppConstants.trackMap.libraries
    });

    const fitMap = useCallback((locationList) => {
        if (currentInfoWindow.current) {
            centerMapByInfoWindow(mapInstance.current, currentInfoWindow.current);
            return;
        }
        fitMapBoundsByLocations(mapInstance.current, locationList);
    }, []);

    const showInfoWindowAsync = useCallback(async trackLocationRecord => {
        if (mapInstance.current) {
            const locationRecord = await getLocationRecordAsync(trackLocationRecord.id);
            if (!locationRecord) return;

            if (currentInfoWindow.current !== null) {
                currentInfoWindow.current.close();
            }

            const address = await getGeocodedAddressAsync(locationRecord);
            const content = ReactDOMServer.renderToString(
                React.createElement(
                    TrackMapInfoWindow,
                    { locationRecord: locationRecord, address: address }
                )
            );
            currentInfoWindow.current = buildInfoWindow(mapInstance.current, content, locationRecord);
        }
    }, [getGeocodedAddressAsync, getLocationRecordAsync]);

    const initOverlays = useCallback(() => {
        if (trackPath.current !== null) {
            trackPath.current.setMap(null);
            trackPath.current = null;
        }

        stationaryClusters.current.forEach(sc => {
            sc.setMap(null);
            sc = null;
        });
        stationaryClusters.current = [];

        currentMarkers.current.forEach(m => {
            m.setMap(null);
            m = null;
        });
        currentMarkers.current = [];

        currentBreakIntervals.current.forEach(bi => {
            bi.setMap(null);
            bi = null;
        });
        currentBreakIntervals.current = [];

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
                lat: trackLocationRecordList[0].latitude,
                lng: trackLocationRecordList[0].longitude
            },
            map: mapInstance.current,
            label: { text: 'A' }
        });
        firstMarker.addListener('click', async () => {
            await showInfoWindowAsync(trackLocationRecordList[0]);
        });
        currentMarkers.current.unshift(firstMarker);
        const lastMarker = new window.google.maps.Marker({
            position: {
                lat: trackLocationRecordList[trackLocationRecordList.length - 1].latitude,
                lng: trackLocationRecordList[trackLocationRecordList.length - 1].longitude
            },
            map: mapInstance.current,
            label: { text: 'B' }
        });
        lastMarker.addListener('click', async () => {
            await showInfoWindowAsync(trackLocationRecordList[trackLocationRecordList.length - 1]);
        });
        currentMarkers.current.push(lastMarker);
    }, [trackLocationRecordList, showInfoWindowAsync]);

    const buildBreakIntervals = useCallback(() => {
        for (let i = 0; i < trackLocationRecordList.length - 1; i++) {

            const currentLocation = new window.google.maps.LatLng({
                lat: trackLocationRecordList[i].latitude,
                lng: trackLocationRecordList[i].longitude
            }), nextLocation = new window.google.maps.LatLng({
                lat: trackLocationRecordList[i + 1].latitude,
                lng: trackLocationRecordList[i + 1].longitude
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
    }, [appSettingsData.breakInterval, trackLocationRecordList]);

    const buildMarkersOnPolylinePath = useCallback(() => {
        let k = 1;
        let diagonalDistance = 0;
        const boundBox = getBoundsByMarkers(trackLocationRecordList);
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

        let p = 1;
        if (trackLocationRecordList.length <= 10) {
            p = 1; // 100 %
        } else if (trackLocationRecordList.length <= 100) {
            p = 5; // 20 %
        } else if (trackLocationRecordList.length <= 500) {
            p = 10 * k; // 10 %
        } else if (trackLocationRecordList.length <= 2500) {
            p = 20 * k; // 5 %a
        } else if (( trackLocationRecordList.length <= 12500 )) {
            p = 40 * k // 1 %
        } else {
            p = 80 * k // < 1 %
        }
        trackLocationRecordList
            .filter((_, i) => i % p === 0)
            .concat(trackLocationRecordList.length > 0 ? trackLocationRecordList[trackLocationRecordList.length - 1] : [])
            .forEach((locationRecord, i) => {
                buildMarker(locationRecord, 'track', i + 1);
            });
    }, [buildMarker, trackLocationRecordList]);

    const showTrack = useCallback(() => {
        fitMap(trackLocationRecordList);
        if (trackPath.current === null && trackLocationRecordList && trackLocationRecordList.length > 0) {

            trackPath.current = new window.google.maps.Polyline({
                path: trackLocationRecordList.map(locationRecord => {
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
    }, [
         fitMap, trackLocationRecordList,
        buildMarkersOnPolylinePath, buildOutsideMarkers, appSettingsData.isShownBreakInterval, buildBreakIntervals
    ]);

    const onTrackMapLoadHandler = useCallback((googleMap) => {
        mapInstance.current = googleMap;
        const delayTimer = setTimeout(() => {
            showTrack();
            clearTimeout(delayTimer);
        }, 150);
    }, [showTrack]);

    useEffect(() => {
        ( async () => {
            let locationRecordsData = await getLocationRecordsByRangeAsync(
                mobileDevice.id,
                currentTimelineItem.beginDate,
                currentTimelineItem.endDate
            ) ?? [];
            setTrackLocationRecordList(locationRecordsData);
        } )()
    }, [getLocationRecordsByRangeAsync, mobileDevice.id, currentTimelineItem, appSettingsData.minimalAccuracy, refreshToken]);

    /*const heatMapData = trackLocationRecordList.map(locationRecord => new window.google.maps.LatLng({
                lat: locationRecord.latitude,
                lng: locationRecord.longitude
            }));

            const heatmap = new window.google.maps.visualization.HeatmapLayer({
                data: heatMapData,
                radius: 10,
                maxIntensity: 10,
                dissipating: true,
            });
            heatmap.setMap(mapInstance.current);*/

    useEffect(() => {
        if (mapInstance.current) {
            initOverlays();
            showTrack();
            if (appSettingsData.isShowStationaryZone) {
                try {
                    showLoader();
                    stationaryClusters.current = showStationaryClusters(mapInstance.current, trackLocationRecordList);

                } finally {
                    hideLoader();
                }
            }
        }
    }, [hideLoader, initOverlays, appSettingsData.isShowStationaryZone, showLoader, showTrack, trackLocationRecordList]);

    TrackMap.fitToMap = function () {
        if(mapInstance && trackLocationRecordList) {
            fitMap(trackLocationRecordList);
        }
    };

    return ( isLoaded && trackLocationRecordList !== null ?
            <>
                <TrackMapHeader
                    mobileDevice={ mobileDevice }
                    timelineItem={ currentTimelineItem }
                    initialDate={ initialDate }
                    onCurrentTimelineItemChanged={ (currentTimelineItem) => {
                        if (currentTimelineItem) {
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
                    onLoad={ onTrackMapLoadHandler }
                    onClick={ () => {
                        if (currentInfoWindow.current !== null) {
                            currentInfoWindow.current.close();
                            currentInfoWindow.current = null;
                        }
                    } }
                    onRightClick={ () => {
                        fitMap(trackLocationRecordList);
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
