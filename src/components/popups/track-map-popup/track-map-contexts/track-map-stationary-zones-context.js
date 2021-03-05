import React, { createContext, useCallback, useContext, useMemo } from 'react';
import AppConstants from '../../../../constants/app-constants';
import geocluster from '../../../geocluster';
import { useAppSettings } from '../../../../contexts/app-settings';
import { useTrackMapUtilsContext } from './track-map-utils-context';

const TrackMapStationaryZonesContext = createContext({});
const useTrackMapStationaryZonesContext = () => useContext(TrackMapStationaryZonesContext);

function TrackMapStationaryZonesProvider (props) {

    const { getBoundsByMarkers } = useTrackMapUtilsContext();
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

    const showStationaryZoneClusters = useCallback( (mapInstance, locationList) => {

        const {
            stationaryZoneBias,
            stationaryZoneMinRadius,
            stationaryZoneMinElementCount,
            stationaryZoneMinCriteriaSpeed
        } = appSettingsData;

        const geoClusterData = locationList
            .filter(locationRecord => locationRecord.speed < stationaryZoneMinCriteriaSpeed)
            .map(locationRecord => [locationRecord.latitude, locationRecord.longitude]);

        const stationaryClusters = [];

        const getFilteredClusters = () => {
            const clusters = geocluster(geoClusterData, stationaryZoneBias);
            return clusters
                .sort((c1, c2) => c2.elements.length - c1.elements.length)
                .filter(c => c.elements.length > stationaryZoneMinElementCount);
        };

        let filteredClusters = getFilteredClusters();

        filteredClusters
            .forEach(c => {
                const [lat, lng] = c.centroid;

                const boundBox = getBoundsByMarkers(c.elements.map(element => {
                    const [lat, lng] = element;
                    return {
                        latitude: lat,
                        longitude: lng
                    };
                }));
                let radius = stationaryZoneMinRadius;
                if (boundBox) {
                    const diagonalDistance = window.google.maps.geometry.spherical.computeDistanceBetween(
                        boundBox.getNorthEast(),
                        boundBox.getSouthWest()
                    );
                    radius = diagonalDistance / 2 < stationaryZoneMinRadius ? stationaryZoneMinRadius : diagonalDistance / 2;
                }

                const circleProps = {
                    ...{
                        radius: radius, center: new window.google.maps.LatLng({
                            lat: lat,
                            lng: lng
                        })
                    }, ...stationaryClusterCircleDefaultProps
                };

                const circle = new window.google.maps.Circle(circleProps);
                circle.setMap(mapInstance);
                stationaryClusters.push(circle);
            });

        return stationaryClusters;
    }, [appSettingsData, getBoundsByMarkers, stationaryClusterCircleDefaultProps]);

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
