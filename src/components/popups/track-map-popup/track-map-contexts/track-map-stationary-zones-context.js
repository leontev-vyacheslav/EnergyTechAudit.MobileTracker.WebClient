import React, { createContext, useCallback, useContext, useMemo, useRef } from 'react';
import AppConstants from '../../../../constants/app-constants';
import { DBSCAN } from 'density-clustering';
import { useAppSettings } from '../../../../contexts/app-settings';
import { useTrackMapUtilsContext } from './track-map-utils-context';
import ReactDOMServer from 'react-dom/server';
import TrackMapInfoWindow from '../track-map/track-map-info-window/track-map-info-window';
import { useAppData } from '../../../../contexts/app-data';

const TrackMapStationaryZonesContext = createContext({});
const useTrackMapStationaryZonesContext = () => useContext(TrackMapStationaryZonesContext);

class SphericalCalculator {

    static toRad(value) {
        return (value * Math.PI) / 180;
    }

    static computeDistanceBetween(lat1, lon1, lat2, lon2) {
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);

        const latRad1 = this.toRad(lat1);
        const latRad2 = this.toRad(lat2);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(latRad1) * Math.cos(latRad2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return 6371000 * c;
    }

    static computeDistanceBetween2(p1, p2) {
        return SphericalCalculator.computeDistanceBetween(p1[0], p1[1], p2[0], p2[1]);
    }
}

function TrackMapStationaryZonesProvider (props) {

    const currentClusterInfoWindow = useRef(null);
    const currentsStationaryClusters = useRef([]);

    const { getGeocodedAddressAsync } = useAppData();
    const { getBoundsByMarkers, getInfoWindow } = useTrackMapUtilsContext();
    const { appSettingsData } = useAppSettings();

    const stationaryClusterCircleDefaultProps = useMemo(() => {
        return ( {
            strokeColor: AppConstants.trackMap.stationaryCircleColor,
            strokeOpacity: AppConstants.trackMap.stationaryCircleStrokeOpacity,
            strokeWeight: AppConstants.trackMap.stationaryCircleStrokeWeight,
            fillColor: AppConstants.trackMap.stationaryCircleColor,
            fillOpacity: AppConstants.trackMap.stationaryCircleFillOpacity,
        } );
    }, []);

    const clearOverlays = useCallback(() => {
        if(currentsStationaryClusters.current.length > 0) {
            currentsStationaryClusters.current.forEach(sc => {
                sc.setMap(null);
                sc = null;
            });
            currentsStationaryClusters.current = [];
        }

        if (currentClusterInfoWindow.current) {
            currentClusterInfoWindow.current.setMap(null);
            currentClusterInfoWindow.current = null;
        }
    }, []);

    const showStationaryZoneClusters = useCallback((mapInstance, locationList) => {

        clearOverlays();

        const {
            stationaryZoneRadius,
            stationaryZoneElementCount,
            stationaryZoneCriteriaSpeed,
            stationaryZoneCriteriaAccuracy,
            useStationaryZoneCriteriaAccuracy
        } = appSettingsData;

        const geoClusterData = locationList
            .filter(locationRecord =>
                locationRecord.speed < stationaryZoneCriteriaSpeed &&
                (!useStationaryZoneCriteriaAccuracy === true || locationRecord.accuracy < stationaryZoneCriteriaAccuracy)
            )
            .map(locationRecord => [locationRecord.latitude, locationRecord.longitude, locationRecord]);

        const dbscan = new DBSCAN();

        const clustersIndexes = dbscan.run(geoClusterData, stationaryZoneRadius, stationaryZoneElementCount, SphericalCalculator.computeDistanceBetween2);
        const geoClusters = clustersIndexes.map((clusterIndexes) => clusterIndexes.map((pointId) => geoClusterData[pointId]));

        geoClusters.forEach( geoCluster => {
            const centroid = getBoundsByMarkers(geoCluster.map(element => {
                const [, , { latitude, longitude }] = element;
                return {
                    latitude: latitude,
                    longitude: longitude
                };
            }));

            const centroidCenter = centroid.getCenter();

            const diagonalDistance = window.google.maps.geometry.spherical.computeDistanceBetween(
                centroid.getNorthEast(),
                centroid.getSouthWest()
            );

            const radius = diagonalDistance / 2 < stationaryZoneRadius ? stationaryZoneRadius : diagonalDistance / 2;

            const circleProps = {
                ...{
                    radius: radius, center: centroidCenter,
                }, ...stationaryClusterCircleDefaultProps
            };

            const circle = new window.google.maps.Circle(circleProps);

            circle.cluster = {
                elements: geoCluster,
                centroid: centroidCenter
            };

            circle.setMap(mapInstance);

            circle.addListener('click', async ()=> {

                if (currentClusterInfoWindow.current) {
                    currentClusterInfoWindow.current.setMap(null);
                    currentClusterInfoWindow.current = null;
                }

                const cluster = circle.cluster;
                const locationRecord = {
                    latitude: cluster.centroid.lat(),
                    longitude: cluster.centroid.lng(),
                    motionActivityTypeId: 8,
                    isCharging: null,
                    speed: cluster.elements
                        .map((element) => element[2].speed)
                        .reduce((prev, curr) => prev + curr, 0) / cluster.elements.length,


                    accuracy: Math.floor((cluster.elements
                        .map((element) => element[2].accuracy)
                        .reduce((prev, curr) => prev + curr, 0) / cluster.elements.length) * 10 ) / 10 ,

                    batteryLevel: null,
                };
                const address = await getGeocodedAddressAsync(locationRecord);

                const content = ReactDOMServer.renderToString(
                    React.createElement(
                        TrackMapInfoWindow,
                        { locationRecord: locationRecord, address: address }
                    )
                );

                currentClusterInfoWindow.current = getInfoWindow(mapInstance, locationRecord, content);

                console.log(cluster);
            });
            currentsStationaryClusters.current.push(circle);
        });
    }, [clearOverlays, appSettingsData, getBoundsByMarkers, stationaryClusterCircleDefaultProps, getGeocodedAddressAsync, getInfoWindow]);

    return (
        <TrackMapStationaryZonesContext.Provider
            value={ {
                showStationaryZoneClusters
            } }
            { ...props }
        />
    );
}

export { TrackMapStationaryZonesProvider, useTrackMapStationaryZonesContext };
