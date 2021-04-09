import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import TrackMapInfoWindow from '../track-map-components/track-map-info-window/track-map-info-window';
import TrackMapInfoBox from '../track-map-components/track-map-info-box/track-map-info-box';
import TrackMapHeader from '../track-map-components/track-map-header/track-map-header';
import AppConstants from '../../../../constants/app-constants';
import TrackMapStationaryZonesPanel from '../track-map-panels/track-map-stationary-zones-panel/track-map-stationary-zones-panel';
import TrackMapSettingsForm from '../track-map-panels/track-map-settings-panel/track-map-settings-panel';
import TrackMapTimelinePanel from '../track-map-panels/track-map-timeline-panel/track-map-timeline-panel';
import { useTrackMapSettingsContext } from '../track-map-contexts/track-map-settings-context';
import { useScreenSize } from '../../../../utils/media-query';
import { useAppData } from '../../../../contexts/app-data';
import { useAppSettings } from '../../../../contexts/app-settings';
import { useTrackMapLocationRecordsContext } from '../track-map-contexts/track-map-location-records-context';
import { useTrackMapUtilsContext } from '../track-map-contexts/track-map-utils-context';

import './track-map.scss';

const TrackMap = ({ mobileDevice }) => {
    const { isXSmall, isSmall } = useScreenSize();
    const { appSettingsData } = useAppSettings();
    const {  getLocationRecordAsync, getGeocodedAddressAsync } = useAppData();
    const { showStationaryZoneClustersAsync, trackLocationRecordList } = useTrackMapLocationRecordsContext();
    const { isShowTrackMapSettings, isShowTrackMapZones, isShowStationaryZone, isShowTrackMapTimeline } = useTrackMapSettingsContext();
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: AppConstants.trackMap.apiKey,
        libraries: AppConstants.trackMap.libraries
    });
    const { setCurrentMapInstance, centerMapByInfoWindow, fitMapBoundsByLocations, getBoundsByMarkers, getBreakIntervals, getInfoWindow, getMarker } = useTrackMapUtilsContext()

    const mapInstance = useRef(null);
    const trackPath = useRef(null);
    const currentMarkers = useRef([]);
    const currentBreakIntervals = useRef([]);
    const currentInfoWindow = useRef(null);

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
        currentBreakIntervals.current = [];

        if (currentInfoWindow.current) {
            currentInfoWindow.current.setMap(null);
            currentInfoWindow.current = null;
        }

    }, []);

    const fitMap = useCallback((locationList) => {
        if (currentInfoWindow.current) {
            centerMapByInfoWindow(currentInfoWindow.current);
            return;
        }
        fitMapBoundsByLocations(locationList);
    }, [centerMapByInfoWindow, fitMapBoundsByLocations]);

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
            currentInfoWindow.current = getInfoWindow(locationRecord, content);
        }
    }, [getGeocodedAddressAsync, getInfoWindow, getLocationRecordAsync]);

    const buildMarker = useCallback((locationRecord, order) => {
        const marker = getMarker(locationRecord, order, async () => {
            await showInfoWindowAsync(locationRecord);
        });
        currentMarkers.current.push(marker);
    }, [getMarker, showInfoWindowAsync]);

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
                buildMarker(locationRecord, i + 1);
            });
    }, [buildMarker, getBoundsByMarkers, trackLocationRecordList]);

    const showTrack = useCallback(() => {
        if (trackPath.current === null && trackLocationRecordList && trackLocationRecordList.length > 0) {
            fitMap(trackLocationRecordList);
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
                currentBreakIntervals.current = getBreakIntervals(trackLocationRecordList, appSettingsData.breakInterval);
            }
        }
    }, [appSettingsData.breakInterval, appSettingsData.isShownBreakInterval, buildMarkersOnPolylinePath, buildOutsideMarkers, fitMap, getBreakIntervals, trackLocationRecordList]);

    const onTrackMapLoadHandler = useCallback((googleMap) => {
        mapInstance.current = googleMap;
        setCurrentMapInstance(googleMap);
        /*const delayTimer = setTimeout(async () => {
            clearTimeout(delayTimer);
            showTrack();
            if (isShowStationaryZone) {
               await showStationaryZoneClustersAsync();
            }
        }, 150);*/
    }, [setCurrentMapInstance]);

    useEffect(() => {
        ( async () => {
            console.log('track-map')
            initOverlays();
            showTrack();
            if (isShowStationaryZone) {
                await showStationaryZoneClustersAsync();
            }
        } )();
    }, [initOverlays, isShowStationaryZone, showStationaryZoneClustersAsync, showTrack]);

    TrackMap.fitToMap = function () {
        if (mapInstance && trackLocationRecordList) {
            fitMap(trackLocationRecordList);
        }
    };

    return ( isLoaded && trackLocationRecordList !== null ?
            <div className={ 'track-map-container' }>
                <div className={ 'track-map-container-header' }>
                    <TrackMapHeader mobileDevice={ mobileDevice }/>
                </div>
                <div className={ `track-map-container-body${ !isXSmall && (isShowTrackMapSettings || isShowTrackMapZones || isShowTrackMapTimeline) ? ' track-map-container-body-split' : '' }` }>
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
                        mapContainerStyle={ { width: '100%', height: '100%' } }
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
                            <TrackMapInfoBox mobileDevice={ mobileDevice } />
                        }
                    </GoogleMap>
                </div>
                { !isXSmall && isShowTrackMapZones && !isShowTrackMapSettings && !isShowTrackMapTimeline ?
                    <div className={ 'dx-card responsive-paddings' }>
                        <TrackMapStationaryZonesPanel />
                    </div>
                    : null
                }
                { !isXSmall && isShowTrackMapSettings && !isShowTrackMapZones && !isShowTrackMapTimeline ?
                    <div className={ 'dx-card responsive-paddings' }>
                       <TrackMapSettingsForm />
                    </div>
                    : null
                }
                { !isXSmall && isShowTrackMapTimeline && !isShowTrackMapZones && !isShowTrackMapSettings ?
                    <div className={ 'dx-card responsive-paddings' }>
                        <TrackMapTimelinePanel />
                    </div>
                    : null
                }
            </div>
            :
            <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
    );
};
export default TrackMap;
