import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AppConstants from '../../../../constants/app-constants';
import { DBSCAN } from 'density-clustering';
import ReactDOMServer from 'react-dom/server';
import TrackMapInfoWindow from '../track-map-components/track-map-info-window/track-map-info-window';
import { AccuracyIcon, ActivityIcon, CountdownIcon, RadiusIcon, SpeedIcon } from '../../../../constants/app-icons';
import { SphericalCalculator } from '../../../../utils/spherical';
import { useTrackMapSettingsContext } from './track-map-settings-context';
import { useAppSettings } from '../../../../contexts/app-settings';
import { useTrackMapUtilsContext } from './track-map-utils-context';
import { useAppData } from '../../../../contexts/app-data';
import { useTrackMapLocationRecordsContext } from './track-map-location-records-context';

const TrackMapStationaryZonesContext = createContext({});

const useTrackMapStationaryZonesContext = () => useContext(TrackMapStationaryZonesContext);

function TrackMapStationaryZonesProvider (props) {

    const { trackLocationRecordList } = useTrackMapLocationRecordsContext();
    const { isShowStationaryZone } = useTrackMapSettingsContext();
    const { currentMapInstance, getBoundsByMarkers, getInfoWindow } = useTrackMapUtilsContext();
    const { getGeocodedAddressAsync, getGeocodedAddressesAsync } = useAppData();
    const { appSettingsData } = useAppSettings();
    const {
        stationaryZoneRadius,
        stationaryZoneElementCount,
        stationaryZoneCriteriaSpeed,
        stationaryZoneCriteriaAccuracy,
        useStationaryZoneCriteriaAccuracy,
        useStationaryZoneAddresses,
    } = appSettingsData;

    const [stationaryClusterList, setStationaryClusterList] = useState([]);
    const [currentStationaryCluster, setCurrentStationaryCluster] = useState(null);

    const currentClusterInfoWindow = useRef(null);
    const currentStationaryClusterCircleList = useRef([]);

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
        if (currentStationaryClusterCircleList.current.length > 0) {
            currentStationaryClusterCircleList.current.forEach(sc => {
                sc.setMap(null);
                sc = null;
            });
            currentStationaryClusterCircleList.current = [];
        }

        if (currentClusterInfoWindow.current) {
            currentClusterInfoWindow.current.setMap(null);
            currentClusterInfoWindow.current = null;
        }
    }, []);

    const showInfoWindowAsync = useCallback(async (clusterIndex) => {

        if (currentClusterInfoWindow.current) {
            currentClusterInfoWindow.current.setMap(null);
            currentClusterInfoWindow.current = null;
        }

        const cluster = stationaryClusterList.find(c => c.index === clusterIndex);

        const locationRecordInfo = {
            latitude: cluster.centroid.lat(),
            longitude: cluster.centroid.lng(),
            motionActivityTypeId: 8,
            isCharging: null,
            speed: cluster.elements
                .map((element) => element[2].speed)
                .reduce((acc, curr) => acc + curr, 0) / cluster.elements.length,

            accuracy: Math.floor(( cluster.elements
                .map((element) => element[2].accuracy)
                .reduce((acc, curr) => acc + curr, 0) / cluster.elements.length ) * 10) / 10,

            batteryLevel: null,
        };

        const address = await getGeocodedAddressAsync(locationRecordInfo);

        let dataSheet = [
            {
                id: 1,
                iconRender: (props) => <CountdownIcon { ...props }/>,
                description: 'Отсчетов:',
                value: `${ cluster.elements.length }`
            },
            {
                id: 1,
                iconRender: (props) => <RadiusIcon { ...props }/>,
                description: 'Радиус центроида:',
                value: `${ Math.floor(cluster.radius * 10) / 10 } м`
            },
            {
                id: 2,
                iconRender: (props) => <AccuracyIcon { ...props }/>,
                description: 'Средняя точность:',
                value: `${ locationRecordInfo.accuracy } м`
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
                { locationRecord: locationRecordInfo, address: address, externalDatasheet: dataSheet }
            )
        );

        currentClusterInfoWindow.current = getInfoWindow(locationRecordInfo, content);

    }, [getGeocodedAddressAsync, getInfoWindow, stationaryClusterList]);

    const showStationaryZoneClustersAsync = useCallback(async () => {
        clearOverlays();
        console.log('showStationaryZoneClustersAsync');
        for (const cluster of stationaryClusterList) {

            const circleProps = {
                ...{
                    radius: cluster.radius, center: cluster.centroid,
                }, ...stationaryClusterCircleDefaultProps
            };

            const circle = new window.google.maps.Circle(circleProps);
            circle.setMap(currentMapInstance);

            circle.addListener('click', async () => {
                await showInfoWindowAsync(cluster.index);
                setCurrentStationaryCluster(circle);
            });
            currentStationaryClusterCircleList.current.push(circle);
        }

    }, [clearOverlays, currentMapInstance, showInfoWindowAsync, stationaryClusterCircleDefaultProps, stationaryClusterList]);

    useEffect(() => {
        clearOverlays();

        ( async () => {
            if (currentMapInstance && isShowStationaryZone && trackLocationRecordList) {
                const currentStationaryClusterList = [];
                const geoClusterData = trackLocationRecordList
                    .filter(locationRecord => locationRecord.speed < stationaryZoneCriteriaSpeed && ( !useStationaryZoneCriteriaAccuracy === true || locationRecord.accuracy < stationaryZoneCriteriaAccuracy ))
                    .map(locationRecord => [locationRecord.latitude, locationRecord.longitude, locationRecord]);

                const dbscan = new DBSCAN();
                const clustersIndexes = dbscan.run(geoClusterData, stationaryZoneRadius, stationaryZoneElementCount, SphericalCalculator.computeDistanceBetween2);
                const geoClusters = clustersIndexes.map((clusterIndexes) => clusterIndexes.map((pointId) => geoClusterData[pointId]));

                let index = 0;

                for (const geoCluster of geoClusters) {

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
                    let formattedAddress = [];

                    if (useStationaryZoneAddresses === true) {
                        const addresses = await getGeocodedAddressesAsync({
                            latitude: centroidCenter.lat(),
                            longitude: centroidCenter.lng(),
                        });
                        if (addresses) {
                            formattedAddress = addresses
                                .filter(a => a.types.includes('street_address') || a.types.includes('premise'))
                                .map(a => a.formatted_address)
                                .filter((val, indx, arr) => arr.indexOf(val) === indx);
                        }
                        if (formattedAddress.length === 0) {
                            formattedAddress.push(AppConstants.noDataLongText);
                        }
                    }

                    const cluster = {
                        id: index,
                        index: index,
                        centroid: centroidCenter,
                        radius: diagonalDistance / 2,
                        elements: geoCluster,
                        addresses: formattedAddress,
                    };

                    currentStationaryClusterList.push(cluster);
                    index++;
                }
                setStationaryClusterList([...currentStationaryClusterList]);
            }
        } )();

    }, [clearOverlays, currentMapInstance, getBoundsByMarkers, getGeocodedAddressesAsync, isShowStationaryZone, stationaryZoneCriteriaAccuracy, stationaryZoneCriteriaSpeed, stationaryZoneElementCount, stationaryZoneRadius, trackLocationRecordList, useStationaryZoneAddresses, useStationaryZoneCriteriaAccuracy])

    useEffect(() => {
        ( async () => {
            if (!isShowStationaryZone) {
                clearOverlays();
            } else {
                await showStationaryZoneClustersAsync();
            }
        } )();
    }, [clearOverlays, isShowStationaryZone, showStationaryZoneClustersAsync]);

    return (
        <TrackMapStationaryZonesContext.Provider
            value={ {
                showInfoWindowAsync,
                stationaryClusterList,
                currentStationaryCluster,
                setCurrentStationaryCluster,
            } }
            { ...props }
        />
    );
}

export { TrackMapStationaryZonesProvider, useTrackMapStationaryZonesContext };
