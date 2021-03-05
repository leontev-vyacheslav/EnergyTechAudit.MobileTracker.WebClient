import AppConstants from '../../../../constants/app-constants';
import React, { createContext, useCallback, useContext } from 'react';

const TrackMapUtilsContext = createContext({});

const useTrackMapUtilsContext = () => useContext(TrackMapUtilsContext);

function TrackMapUtilsProvider (props) {
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

    const fitMapBoundsByLocations = useCallback((mapInstance, locationList) => {
        if (locationList && locationList.length > 0) {
            const boundBox = getBoundsByMarkers(locationList);
            if (boundBox) {
                mapInstance.setCenter(boundBox.getCenter());
                mapInstance.fitBounds(boundBox);
            }
        }
    }, [getBoundsByMarkers]);

    const getInfoWindow = useCallback((mapInstance, locationRecord, content) => {

        const infoWindow = new window.google.maps.InfoWindow({
            position: {
                lat: locationRecord.latitude,
                lng: locationRecord.longitude
            },
            content: content,
        });

        mapInstance.setCenter({
            lat: locationRecord.latitude,
            lng: locationRecord.longitude
        });
        const currentZoom = mapInstance.getZoom();
        if (currentZoom <= AppConstants.trackMap.defaultZoom) {
            mapInstance.setZoom(AppConstants.trackMap.defaultZoom);
        }
        infoWindow.open(mapInstance);
        return infoWindow;
    }, []);

    const centerMapByInfoWindow = useCallback((mapInstance, infoWindow) => {
        if (infoWindow) {
            const currentZoom = mapInstance.getZoom();
            if (currentZoom <= AppConstants.trackMap.defaultZoom) {
                mapInstance.setZoom(AppConstants.trackMap.defaultZoom);
            }
            mapInstance.setCenter(infoWindow.getPosition());
        }
    }, []);

    const getBreakIntervals = useCallback( (mapInstance, locationList, breakInterval) => {
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
                    breakIntervalPath.setMap(mapInstance);
                    breakIntervals.push(breakIntervalPath);
                }
            }
        }
        return breakIntervals;
    }, []);

    const getMarker = useCallback((mapInstance, locationRecord, order, onClickAsync) => {
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

        marker.setMap(mapInstance);
        return marker;
    }, []);

    return (
        <TrackMapUtilsContext.Provider
            value={ {
                getBoundsByMarkers, fitMapBoundsByLocations, centerMapByInfoWindow, getInfoWindow, getBreakIntervals, getMarker
            } }
            { ...props }
        />
    );
}

export  { TrackMapUtilsProvider, useTrackMapUtilsContext };
