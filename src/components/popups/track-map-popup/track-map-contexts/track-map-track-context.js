import AppConstants from '../../../../constants/app-constants';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { useAppData } from '../../../../contexts/app-data';
import TrackMapInfoWindow from '../track-map-components/track-map-info-window/track-map-info-window';
import { useAppSettings } from '../../../../contexts/app-settings';
import { useTrackMapLocationRecordsContext } from './track-map-location-records-context';

const TrackMapTrackContext = createContext({});

const useTrackMapTrackContext = () => useContext(TrackMapTrackContext);

function TrackMapTrackProvider (props) {
    const { appSettingsData } = useAppSettings();
    const { getLocationRecordAsync, getGeocodedSelectedAddressesAsync } = useAppData();
    const { trackLocationRecordList } = useTrackMapLocationRecordsContext();
    const [currentMapInstance, setCurrentMapInstance] = useState(null);

    const currentInfoWindow = useRef(null);
    const trackPath = useRef(null);
    const currentMarkers = useRef([]);
    const currentBreakIntervals = useRef([]);

    const getBoundsByMarkers = useCallback((locationList) => {
        if (currentMapInstance) {
            const boundBox = new window.google.maps.LatLngBounds();
            for (let i = 0; i < locationList.length; i++) {
                boundBox.extend({
                    lat: locationList[i].latitude,
                    lng: locationList[i].longitude
                });
            }
            return boundBox;
        }
    }, [currentMapInstance]);

    const buildInfoWindow = useCallback((locationRecord, content) => {
        if (currentMapInstance) {
            const infoWindow = new window.google.maps.InfoWindow({
                position: {
                    lat: locationRecord.latitude,
                    lng: locationRecord.longitude
                },
                content: content,
            });

            currentMapInstance.setCenter({
                lat: locationRecord.latitude,
                lng: locationRecord.longitude
            });
            const currentZoom = currentMapInstance.getZoom();
            if (currentZoom <= AppConstants.trackMap.defaultZoom) {
                currentMapInstance.setZoom(AppConstants.trackMap.defaultZoom);
            }
            infoWindow.open(currentMapInstance);
            return infoWindow;
        }
    }, [currentMapInstance]);

    const centerMapByInfoWindow = useCallback((infoWindow) => {
        if (infoWindow) {
            const currentZoom = currentMapInstance.getZoom();
            if (currentZoom <= AppConstants.trackMap.defaultZoom) {
                currentMapInstance.setZoom(AppConstants.trackMap.defaultZoom);
            }
            currentMapInstance.setCenter(infoWindow.getPosition());
        }
    }, [currentMapInstance]);

    const closeAllOverlays = useCallback(() => {
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

    const fitMapBoundsByLocations = useCallback(() => {
        if (currentInfoWindow.current) {
            centerMapByInfoWindow(currentInfoWindow.current);
            return;
        }
        if (currentMapInstance && trackLocationRecordList && trackLocationRecordList.length > 0) {
            const boundBox = getBoundsByMarkers(trackLocationRecordList);
            if (boundBox) {
                currentMapInstance.setCenter(boundBox.getCenter());
                currentMapInstance.fitBounds(boundBox);
            }
        }

    }, [centerMapByInfoWindow, currentMapInstance, getBoundsByMarkers, trackLocationRecordList]);

    const showInfoWindowAsync = useCallback(async trackLocationRecord => {
        if (currentMapInstance) {
            const locationRecord = await getLocationRecordAsync(trackLocationRecord.id);
            if (!locationRecord) return;

            if (currentInfoWindow.current !== null) {
                currentInfoWindow.current.close();
            }

            const addresses = await getGeocodedSelectedAddressesAsync(locationRecord);
            const content = ReactDOMServer.renderToString(
                React.createElement(
                    TrackMapInfoWindow,
                    { locationRecord: locationRecord, addresses: addresses }
                )
            );
            currentInfoWindow.current = buildInfoWindow(locationRecord, content);
        }
    }, [currentMapInstance, getGeocodedSelectedAddressesAsync, buildInfoWindow, getLocationRecordAsync]);

    const closeInfoWindow = useCallback(() => {
        if (currentInfoWindow.current !== null) {
            currentInfoWindow.current.close();
            currentInfoWindow.current = null;
        }
    }, []);

    const buildBreakIntervals = useCallback((locationList, breakInterval) => {
        const breakIntervals = [];
        if (currentMapInstance && locationList && locationList.length > 0) {

            for (let i = 0; i < locationList.length - 1; i++) {
                const currentLocation = new window.google.maps.LatLng({
                    lat: locationList[i].latitude,
                    lng: locationList[i].longitude
                }), nextLocation = new window.google.maps.LatLng({
                    lat: locationList[i + 1].latitude,
                    lng: locationList[i + 1].longitude
                });

                const distance = window.google.maps.geometry.spherical.computeDistanceBetween(currentLocation, nextLocation);

                if (distance >= breakInterval) {
                    const breakIntervalPath = new window.google.maps.Polyline({
                        path: [currentLocation, nextLocation],
                        geodesic: true,
                        strokeColor: AppConstants.trackMap.breakIntervalPathStrokeColor,
                        strokeOpacity: AppConstants.trackMap.breakIntervalPathStrokeOpacity,
                        strokeWeight: AppConstants.trackMap.polylineTrackPathStrokeWeight,
                    });
                    breakIntervalPath.setMap(currentMapInstance);
                    breakIntervals.push(breakIntervalPath);
                }
            }
        }
        return breakIntervals;
    }, [currentMapInstance]);

    const buildMarker = useCallback((locationRecord, order) => {

        const marker = new window.google.maps.Marker(
            {
                position: {
                    lat: locationRecord.latitude,
                    lng: locationRecord.longitude
                },
                label: {
                    text: `${ order }`,
                    fontSize: AppConstants.trackMap.markerLabelFontSize,
                    color: AppConstants.trackMap.markerLabelColor,
                    fontWeight: AppConstants.trackMap.markerLabelFontWeight
                },
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
            await showInfoWindowAsync(locationRecord)
        });
        marker.setMap(currentMapInstance);
        currentMarkers.current.push(marker);
    }, [currentMapInstance, showInfoWindowAsync]);

    const buildOutsideMarkers = useCallback(() => {
        const firstMarker = new window.google.maps.Marker({
            position: {
                lat: trackLocationRecordList[0].latitude,
                lng: trackLocationRecordList[0].longitude
            },
            map: currentMapInstance,
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
            map: currentMapInstance,
            label: { text: 'B' }
        });
        lastMarker.addListener('click', async () => {
            await showInfoWindowAsync(trackLocationRecordList[trackLocationRecordList.length - 1]);
        });
        currentMarkers.current.push(lastMarker);
    }, [currentMapInstance, showInfoWindowAsync, trackLocationRecordList]);

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
        if (currentMapInstance && trackPath.current === null && trackLocationRecordList.length > 0) {
            fitMapBoundsByLocations();

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
            trackPath.current.setMap(currentMapInstance);
            buildMarkersOnPolylinePath();
            buildOutsideMarkers();
            if (appSettingsData.isShownBreakInterval) {
                currentBreakIntervals.current = buildBreakIntervals(trackLocationRecordList, appSettingsData.breakInterval);
            }
        }
    }, [appSettingsData.breakInterval, appSettingsData.isShownBreakInterval, buildMarkersOnPolylinePath, buildOutsideMarkers, currentMapInstance, fitMapBoundsByLocations, buildBreakIntervals, trackLocationRecordList]);

    useEffect(() => {
        closeAllOverlays();
        showTrack();
    }, [closeAllOverlays, showTrack]);

    TrackMapTrackProvider.fitMapBoundsByLocations = fitMapBoundsByLocations;

    return (
        <TrackMapTrackContext.Provider
            value={ {
                currentMapInstance, setCurrentMapInstance,
                getBoundsByMarkers, buildInfoWindow,
                fitMapBoundsByLocations, closeInfoWindow
            } }
            { ...props }
        />
    );
}

export { TrackMapTrackProvider, useTrackMapTrackContext };
