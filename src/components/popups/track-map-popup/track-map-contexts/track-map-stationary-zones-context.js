import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AppConstants from '../../../../constants/app-constants';
import { DBSCAN } from 'density-clustering';
import { useAppSettings } from '../../../../contexts/app-settings';
import { useTrackMapUtilsContext } from './track-map-utils-context';
import ReactDOMServer from 'react-dom/server';
import TrackMapInfoWindow from '../track-map/track-map-info-window/track-map-info-window';
import { useAppData } from '../../../../contexts/app-data';
import { AccuracyIcon, ActivityIcon, CountdownIcon, RadiusIcon, SpeedIcon } from '../../../../constants/app-icons';
import { SphericalCalculator } from '../../../../utils/spherical';

const TrackMapStationaryZonesContext = createContext({});
const useTrackMapStationaryZonesContext = () => useContext(TrackMapStationaryZonesContext);

function TrackMapStationaryZonesProvider (props) {
    const [stationaryClusterList, setStationaryClusterList] = useState([]);

    const { getBoundsByMarkers, getInfoWindow } = useTrackMapUtilsContext();
    const { getGeocodedAddressAsync } = useAppData();
    const { appSettingsData } = useAppSettings();

    const currentClusterInfoWindow = useRef(null);
    const currentsStationaryClusters = useRef([]);

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

    const showInfoWindowAsync = useCallback(async (circle) => {

        if (currentClusterInfoWindow.current) {
            currentClusterInfoWindow.current.setMap(null);
            currentClusterInfoWindow.current = null;
        }

        const cluster = circle.cluster;

        const locationRecordInfo = {
            latitude: cluster.centroid.lat(),
            longitude: cluster.centroid.lng(),
            motionActivityTypeId: 8,
            isCharging: null,
            speed: cluster.elements
                .map((element) => element[2].speed)
                .reduce((acc, curr) => acc + curr, 0) / cluster.elements.length,

            accuracy: Math.floor((cluster.elements
                .map((element) => element[2].accuracy)
                .reduce((acc, curr) => acc + curr, 0) / cluster.elements.length) * 10 ) / 10 ,

            batteryLevel: null,
        };

        const address = await getGeocodedAddressAsync(locationRecordInfo);

        let dataSheet = [
            {
                id: 1,
                iconRender: (props) => <CountdownIcon { ...props }/>,
                description: 'Отсчетов:',
                value: `${cluster.elements.length}`
            },
            {
                id: 1,
                iconRender: (props) => <RadiusIcon { ...props }/>,
                description: 'Радиус центроида:',
                value: `${Math.floor(cluster.centroidRadius * 10  ) / 10} м`
            },
            {
                id: 2,
                iconRender: (props) => <AccuracyIcon { ...props }/>,
                description: 'Средняя точность:',
                value: `${locationRecordInfo.accuracy} м`
            },
            {
                id: 3,
                iconRender: (props) => <ActivityIcon { ...props }/>,
                description: 'Активность:',
                value: 'В зоне стационарности'
            },
            {
                id: 4,
                iconRender: (props) => <SpeedIcon { ...props }/>,
                description: 'Средняя скорость:',
                value: locationRecordInfo.speed < 0 ? '-' : `${ Math.floor(locationRecordInfo.speed * 3.6 * 100) / 100 } км/ч`
            }
        ];

        const content = ReactDOMServer.renderToString(
            React.createElement(
                TrackMapInfoWindow,
                { locationRecord: locationRecordInfo, address: address,  externalDatasheet: dataSheet }
            )
        );

        currentClusterInfoWindow.current = getInfoWindow(circle.getMap(), locationRecordInfo, content);

    }, [getGeocodedAddressAsync, getInfoWindow]);

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

            const radius = diagonalDistance / 2;

            const circleProps = {
                ...{
                    radius: radius, center: centroidCenter,
                }, ...stationaryClusterCircleDefaultProps
            };
            const circle = new window.google.maps.Circle(circleProps);

            circle.cluster = {
                elements: geoCluster,
                centroid: centroidCenter,
                centroidRadius: diagonalDistance / 2
            };

            circle.setMap(mapInstance);

            circle.addListener('click', async () => {
                await showInfoWindowAsync(circle);
            });

            currentsStationaryClusters.current.push(circle);
        });

        setStationaryClusterList(currentsStationaryClusters.current);

    }, [clearOverlays, appSettingsData, getBoundsByMarkers, stationaryClusterCircleDefaultProps, showInfoWindowAsync]);

    useEffect(() => {
        if (!appSettingsData.isShowStationaryZone) {
            clearOverlays();
        }
    }, [appSettingsData.isShowStationaryZone, clearOverlays]);

    return (
        <TrackMapStationaryZonesContext.Provider
            value={ {
                showStationaryZoneClusters,
                showInfoWindowAsync,
                stationaryClusterList,
                setStationaryClusterList
            } }
            { ...props }
        />
    );
}

export { TrackMapStationaryZonesProvider, useTrackMapStationaryZonesContext };
