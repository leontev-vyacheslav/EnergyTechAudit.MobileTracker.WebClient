import AppConstants from '../../../../constants/app-constants';
import React, { createContext, useCallback, useContext, useState } from 'react';

const TrackMapUtilsContext = createContext({});

const useTrackMapUtilsContext = () => useContext(TrackMapUtilsContext);

function TrackMapUtilsProvider (props) {

    const [currentMapInstance, setCurrentMapInstance] = useState(null);

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

    const fitMapBoundsByLocations = useCallback((locationList) => {
        if (currentMapInstance && locationList && locationList.length > 0) {
            const boundBox = getBoundsByMarkers(locationList);
            if (boundBox) {
                currentMapInstance.setCenter(boundBox.getCenter());
                currentMapInstance.fitBounds(boundBox);
            }
        }
    }, [currentMapInstance, getBoundsByMarkers]);

    const getInfoWindow = useCallback((locationRecord, content) => {

        if(!currentMapInstance) return null;

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

    const getBreakIntervals = useCallback( (locationList, breakInterval) => {
        const breakIntervals = [];
        if(locationList && locationList.length > 0) {

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

    const getMarker = useCallback((locationRecord, order, onClickAsync) => {
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
        marker.addListener('click', onClickAsync);

        marker.setMap(currentMapInstance);
        return marker;
    }, [currentMapInstance]);

    return (
        <TrackMapUtilsContext.Provider
            value={ {
                currentMapInstance, setCurrentMapInstance,
                getBoundsByMarkers, fitMapBoundsByLocations, centerMapByInfoWindow, getInfoWindow, getBreakIntervals, getMarker
            } }
            { ...props }
        />
    );
}

export  { TrackMapUtilsProvider, useTrackMapUtilsContext };
