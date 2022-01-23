import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AppConstants from '../../../../constants/app-constants';
import ReactDOMServer from 'react-dom/server';
import TrackMapInfoWindow from '../track-map-components/track-map-info-window/track-map-info-window';
import { AccuracyIcon, CountdownIcon, RadiusIcon, SpeedIcon } from '../../../../constants/app-icons';
import { useTrackMapSettingsContext } from './track-map-settings-context';
import { useAppSettings } from '../../../../contexts/app-settings';
import { useTrackMapTrackContext } from './track-map-track-context';
import { useAppData } from '../../../../contexts/app-data';
import { useTrackMapLocationRecordsContext } from './track-map-location-records-context';
import { getGeoClusters } from '../../../../utils/geo-cluster-helper';
import { AppBaseProviderProps } from '../../../../models/app-base-provider-props';
import { IconBaseProps } from 'react-icons/lib/cjs/iconBase';
import { Cluster } from '../../../../models/cluster';
import {
    TrackLocationRecordModel
} from '../../../../models/track-location-record';
import {
    ShowInfoWindowAsyncFunc,
    TrackMapStationaryZonesContextModel
} from '../../../../models/track-map-stationary-zones-context';
import { LocationRecordDataModel } from '../../../../models/location-record-data';

const TrackMapStationaryZonesContext = createContext<TrackMapStationaryZonesContextModel>({} as TrackMapStationaryZonesContextModel);

const useTrackMapStationaryZonesContext = () => useContext(TrackMapStationaryZonesContext);

function TrackMapStationaryZonesProvider (props: AppBaseProviderProps) {

    const { trackLocationRecordList } = useTrackMapLocationRecordsContext();
    const { isShowStationaryZone } = useTrackMapSettingsContext();
    const { currentMapInstance, getBoundsByMarkers, buildInfoWindow } = useTrackMapTrackContext();
    const { getGeocodedSelectedAddressesAsync } = useAppData();
    const { appSettingsData } = useAppSettings();
    const {
        stationaryZoneRadius,
        stationaryZoneElementCount,
        stationaryZoneCriteriaSpeed,
        stationaryZoneCriteriaAccuracy,
        useStationaryZoneCriteriaAccuracy,
        useStationaryZoneAddressesOnMap,
    } = appSettingsData;

    const [stationaryClusterList, setStationaryClusterList] = useState<Cluster[]>([]);
    const [currentStationaryCluster, setCurrentStationaryCluster] = useState<Cluster | null>(null);

    const currentClusterInfoWindow = useRef<google.maps.InfoWindow | null>(null);
    const currentStationaryClusterCircleList = useRef<google.maps.Circle[]>([]);

    const stationaryClusterCircleDefaultProps = useMemo(() => {
        return ( {
            strokeColor: AppConstants.trackMap.stationaryCircleColor,
            strokeOpacity: AppConstants.trackMap.stationaryCircleStrokeOpacity,
            strokeWeight: AppConstants.trackMap.stationaryCircleStrokeWeight,
            fillColor: AppConstants.trackMap.stationaryCircleColor,
            fillOpacity: AppConstants.trackMap.stationaryCircleFillOpacity,
        } );
    }, []);

    const closeAllOverlays = useCallback(() => {
        if (currentStationaryClusterCircleList.current.length > 0) {
            currentStationaryClusterCircleList.current.forEach((sc: google.maps.Circle) => {
                sc.setMap(null);
            });
            currentStationaryClusterCircleList.current = [];
        }

        if (currentClusterInfoWindow.current) {
            currentClusterInfoWindow.current?.close();
            currentClusterInfoWindow.current = null;
        }
    }, []);

    const showInfoWindowAsync = useCallback<ShowInfoWindowAsyncFunc>(async (clusterIndex: number) => {
        if (currentClusterInfoWindow.current) {
            currentClusterInfoWindow.current.close();
            currentClusterInfoWindow.current = null;
        }

        const cluster = stationaryClusterList.find(c => c.index === clusterIndex);

        if (!cluster || !cluster.centroid) {
             return;
        }

        const locationRecordInfo = {
            latitude: (cluster.centroid as google.maps.LatLng).lat(),
            longitude: (cluster.centroid as google.maps.LatLng).lng(),
            motionActivityTypeId: 8,
            isCharging: false,
            speed: cluster.elements
                .map((element) => (element[2] as TrackLocationRecordModel).speed)
                .reduce((acc, curr) => acc + curr, 0) / cluster.elements.length,

            accuracy: Math.floor(( cluster.elements
                .map((element) => (element[2] as TrackLocationRecordModel).accuracy)
                .reduce((acc, curr) => acc + curr, 0) / cluster.elements.length ) * 10) / 10,

            batteryLevel: 1,
        } as LocationRecordDataModel;

        const selectedAddress = await  getGeocodedSelectedAddressesAsync(locationRecordInfo) ;

        if(selectedAddress) {
            const dataSheet = [
                {
                    id: 1,
                    iconRender: (props: IconBaseProps) => <CountdownIcon { ...props } />,
                    description: 'Отсчетов:',
                    value: `${cluster.elements.length}`
                },
                {
                    id: 1,
                    iconRender: (props: IconBaseProps) => <RadiusIcon { ...props } />,
                    description: 'Радиус центроида:',
                    value: `${Math.floor(cluster.radius * 10) / 10} м`
                },
                {
                    id: 2,
                    iconRender: (props: IconBaseProps) => <AccuracyIcon { ...props } />,
                    description: 'Средняя точность:',
                    value: `${locationRecordInfo.accuracy} м`
                },
                {
                    id: 4,
                    iconRender: (props: IconBaseProps) => <SpeedIcon { ...props } />,
                    description: 'Средняя скорость:',
                    value: locationRecordInfo.speed < 0 ? '-' : `${Math.floor(locationRecordInfo.speed * 3.6 * 100) / 100} км/ч`
                }
            ];

            const content = ReactDOMServer.renderToString(
              React.createElement(
                TrackMapInfoWindow,
                { locationRecord: locationRecordInfo, addresses: selectedAddress, externalDatasheet: dataSheet }
              )
            );


            const offset = window.google.maps.geometry.spherical.computeOffset
            (
              new window.google.maps.LatLng(locationRecordInfo.latitude, locationRecordInfo.longitude),
              0.85 * cluster.radius, 0
            );
            if (offset) {
                locationRecordInfo.latitude = offset.lat();
                locationRecordInfo.longitude = offset.lng();
            }

            currentClusterInfoWindow.current = buildInfoWindow(locationRecordInfo, content);
        }

    }, [stationaryClusterList, getGeocodedSelectedAddressesAsync, buildInfoWindow]);

    const buildStationaryZoneClusters = useCallback(() => {
        for (const cluster of stationaryClusterList) {
            const circleProps = {
                ...{
                    radius: cluster.radius, center: cluster.centroid,
                }, ...stationaryClusterCircleDefaultProps
            } as google.maps.CircleOptions;

            const circle = new window.google.maps.Circle(circleProps);
            circle.setMap(currentMapInstance);

            circle.addListener('click', async () => {
                await showInfoWindowAsync(cluster.index);

                setCurrentStationaryCluster(cluster);
            });
            currentStationaryClusterCircleList.current.push(circle);
        }
    }, [currentMapInstance, showInfoWindowAsync, stationaryClusterCircleDefaultProps, stationaryClusterList]);

    const constructStationaryClusterListAsync = useCallback( async () => {
        if (currentMapInstance && trackLocationRecordList.length > 0) {
            const currentStationaryClusterList: Cluster[] = [];

            const geoClusters = getGeoClusters(trackLocationRecordList, {
                stationaryZoneRadius,
                stationaryZoneElementCount,
                stationaryZoneCriteriaSpeed,
                stationaryZoneCriteriaAccuracy,
                useStationaryZoneCriteriaAccuracy
            });

            let index = 0;

            for (const geoCluster of geoClusters) {

                const centroid = getBoundsByMarkers(geoCluster.map(element => {
                    const [, , { latitude, longitude }] = element;
                    return {
                        id: Number.MIN_VALUE,
                        heading: Number.MIN_VALUE,
                        speed: Number.MIN_VALUE,
                        accuracy: Number.MIN_VALUE,
                        mobileDeviceDateTime: new Date(),
                        latitude: latitude,
                        longitude: longitude
                    } as TrackLocationRecordModel;
                }));

                if (!centroid) {
                    continue;
                }

                const centroidCenter = centroid.getCenter();
                const diagonalDistance = window.google.maps.geometry.spherical.computeDistanceBetween(
                    centroid.getNorthEast(),
                    centroid.getSouthWest()
                );

                let selectedAddresses: string[] = [];
                if (useStationaryZoneAddressesOnMap) {
                    selectedAddresses = await  getGeocodedSelectedAddressesAsync({
                        latitude: centroidCenter.lat(),
                        longitude: centroidCenter.lng(),
                    } as LocationRecordDataModel) ?? [] ;
                }

                const cluster: Cluster = {
                    id: index,
                    index: index,
                    centroid: centroidCenter,
                    radius: diagonalDistance / 2,
                    elements: geoCluster,
                    addresses: selectedAddresses,
                    speed: 0,
                    accuracy: 0,
                    count: 0
                };
                currentStationaryClusterList.push(cluster);
                index++;
            }
            setStationaryClusterList(currentStationaryClusterList);
        } else {
            setStationaryClusterList([]);
        }
        }, [currentMapInstance, getBoundsByMarkers, getGeocodedSelectedAddressesAsync, stationaryZoneCriteriaAccuracy, stationaryZoneCriteriaSpeed, stationaryZoneElementCount, stationaryZoneRadius, trackLocationRecordList, useStationaryZoneAddressesOnMap, useStationaryZoneCriteriaAccuracy]
    );

    useEffect(() => {
        ( async () => {
            if (isShowStationaryZone) {
                await constructStationaryClusterListAsync();
            } else {
                setStationaryClusterList([]);
            }
        } )();
    }, [constructStationaryClusterListAsync, isShowStationaryZone])

    useEffect(() => {
        closeAllOverlays();
        if (isShowStationaryZone) {
            buildStationaryZoneClusters();
        }
    }, [closeAllOverlays, isShowStationaryZone, buildStationaryZoneClusters]);

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
