import React, { useCallback, useEffect, useRef, useState } from 'react';
import DataGrid, { Scrolling, Column, LoadPanel } from 'devextreme-react/ui/data-grid';
import { useAppData } from '../../../contexts/app-data';
import { useAppSettings } from '../../../contexts/app-settings';
import AppConstants from '../../../constants/app-constants';
import { useJsApiLoader } from '@react-google-maps/api';
import { AccuracyIcon, AddressIcon, CountdownIcon, RadiusIcon, SpeedIcon } from '../../../constants/app-icons';
import DataGridIconCellValueContainer from '../../../components/data-grid-utils/data-grid-icon-cell-value-container';
import { Template } from 'devextreme-react/core/template';
import StationaryZoneMainContextMenu from './stationary-zones-main-context-menu/stationary-zones-main-context-menu';
import { stationaryZonesExcelExporter } from './stationary-zones-excel-exporter';
import { DataGridToolbarButton, onDataGridToolbarPreparing } from '../../../components/data-grid-utils/data-grid-toolbar-button';
import { getGeoClusters } from '../../../utils/geo-cluster-helper';

const StationaryZones = ({ mobileDevice, workDate }) => {
    const dxDataGridRef = useRef();
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: AppConstants.trackMap.apiKey,
        libraries: AppConstants.trackMap.libraries
    });

    const mainContextMenuRef = useRef(null);
    const [stationaryClusterList, setStationaryClusterList] = useState([]);
    const { getLocationRecordsByRangeAsync, getGeocodedSelectedAddressesAsync } = useAppData();

    const getBoundsByMarkers = useCallback((locationList) => {
        if (isLoaded === false) return null;

        const boundBox = new window.google.maps.LatLngBounds();
        for (let i = 0; i < locationList.length; i++) {
            boundBox.extend({
                lat: locationList[i].latitude,
                lng: locationList[i].longitude
            });
        }
        return boundBox;
    }, [isLoaded]);

    const {
        appSettingsData: {
            workDate: appSettingsWorkDate,
            stationaryZoneRadius,
            stationaryZoneElementCount,
            stationaryZoneCriteriaSpeed,
            stationaryZoneCriteriaAccuracy,
            useStationaryZoneCriteriaAccuracy,
            useStationaryZoneAddressesOnList
        }
    } = useAppSettings();

    const [currentWorkDate] = useState(workDate ?? appSettingsWorkDate);

    useEffect(() => {
        ( async () => {
            if (isLoaded === false) return;
            const beginDate = new Date(currentWorkDate),
                endDate = new Date(currentWorkDate);
            endDate.setHours(24);

            let locationRecordsData = await getLocationRecordsByRangeAsync(
                mobileDevice.id,
                beginDate,
                endDate
            ) ?? [];

            const geoClusters = getGeoClusters(locationRecordsData, {
                stationaryZoneRadius,
                stationaryZoneElementCount,
                stationaryZoneCriteriaSpeed,
                stationaryZoneCriteriaAccuracy,
                useStationaryZoneCriteriaAccuracy
            });

            let clusterList = [];
            let index = 0;
            for (const geoCluster of geoClusters) {

                const centroid = getBoundsByMarkers(geoCluster.map(element => {
                    const [, , { latitude, longitude }] = element;
                    return {
                        latitude: latitude,
                        longitude: longitude
                    };
                }));
                const diagonalDistance = window.google.maps.geometry.spherical.computeDistanceBetween(
                    centroid.getNorthEast(),
                    centroid.getSouthWest()
                );
                const radius = diagonalDistance / 2;
                let selectedAddresses = [];

                if (useStationaryZoneAddressesOnList === true) {
                    selectedAddresses = await getGeocodedSelectedAddressesAsync({
                        latitude: centroid.getCenter().lat(),
                        longitude: centroid.getCenter().lng(),
                    });
                }

                clusterList.push({
                    id: index + 1,
                    index: index + 1,
                    centroid: centroid,
                    radius: radius,
                    elements: geoCluster,
                    count: geoCluster.length,
                    addresses: selectedAddresses,
                    speed: geoCluster
                        .map((element) => element[2].speed)
                        .reduce((acc, curr) => acc + curr) / geoCluster.length,
                    accuracy: Math.floor(( geoCluster
                        .map((element) => element[2].accuracy)
                        .reduce((acc, curr) => acc + curr) / geoCluster.length ) * 10) / 10
                })
                index++;
            }
            setStationaryClusterList(clusterList);
        } )();
    }, [currentWorkDate, getBoundsByMarkers, getGeocodedSelectedAddressesAsync, getLocationRecordsByRangeAsync, isLoaded, mobileDevice.id, stationaryZoneCriteriaAccuracy, stationaryZoneCriteriaSpeed, stationaryZoneElementCount, stationaryZoneRadius, useStationaryZoneAddressesOnList, useStationaryZoneCriteriaAccuracy]);

    if (stationaryClusterList.length > 0) {
        return (
            <>
                <DataGrid
                    className={ 'app-grid compact app-grid-detail dx-card wide-card' }
                    dataSource={ stationaryClusterList }
                    ref={ dxDataGridRef }
                    width={ '100%' }
                    keyExpr={ 'id' }
                    focusedRowEnabled={ true }
                    showColumnLines={ true }
                    showRowLines={ true }
                    onToolbarPreparing={ onDataGridToolbarPreparing }
                    showBorders={ true }
                    noDataText={ AppConstants.noDataLongText }>
                    <LoadPanel enabled={ false }/>
                    <Scrolling showScrollbar={ 'never' }/>
                    <Template name={ 'DataGridToolbarButtonTemplate' } render={ DataGridToolbarButton.bind(this, { contextMenuRef: mainContextMenuRef }) }/>

                    <Column dataField={ 'id' } dataType={ 'number' } caption={ 'Зона' } width={ 60 } alignment={ 'center' }/>
                    {
                        useStationaryZoneAddressesOnList === true ?
                            <Column dataField={ 'addresses' } dataType={ 'string' } caption={ 'Адреса' } alignment={ 'left' }
                                    cellRender={ (e) => {
                                        return <DataGridIconCellValueContainer rowStyle={ { fontSize: 12 } }
                                                   cellDataFormatter={ () => {
                                                       return (
                                                           <div style={ { display: 'grid', rowGap: 10 } }>
                                                               { e.data.addresses.map((a, i) => ( <div key={ i }>{ a }</div> )) }
                                                           </div>
                                                       )
                                                   } }
                                                   iconRenderer={ (iconProps) => <AddressIcon { ...iconProps } /> }
                                        />
                                    } }
                            />
                            : null
                    }
                    <Column dataField={ 'count' } dataType={ 'number' } caption={ 'Отсчеты' } width={ 120 } alignment={ 'left' } hidingPriority={ 4 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => `${ e.data.count } ` }
                                    iconRenderer={ (iconProps) => <CountdownIcon { ...iconProps } /> }
                                /> }
                    />
                    <Column dataField={ 'radius' } dataType={ 'number' } caption={ 'Радиус, м' } width={ 120 } alignment={ 'left' } hidingPriority={ 2 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => `${ ( e.data.radius ).toFixed(2) } м` }
                                    iconRenderer={ (iconProps) => <RadiusIcon { ...iconProps } /> }
                                /> }
                    />
                    <Column dataField={ 'speed' } dataType={ 'number' } caption={ 'Скорость, км/ч' } width={ 120 } alignment={ 'left' } hidingPriority={ 1 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => `${ e.data.speed < 0 ? '-' : ( ( e.data.speed * 3.6 * 100 ) / 100 ).toFixed(2) } км/ч` }
                                    iconRenderer={ (iconProps) => <SpeedIcon { ...iconProps } /> }
                                /> }
                    />
                    <Column dataField={ 'accuracy' } dataType={ 'number' } caption={ 'Точность, м' } alignment={ 'left' } hidingPriority={ 3 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => `${ ( e.data.accuracy ).toFixed(2) } м` }
                                    iconRenderer={ (iconProps) => <AccuracyIcon { ...iconProps } /> }
                                /> }
                    />
                </DataGrid>

                <StationaryZoneMainContextMenu
                    ref={ mainContextMenuRef }
                    commands={
                        {
                            exportToXlsx: () => {
                                stationaryZonesExcelExporter({
                                    dxDataGrid: dxDataGridRef.current.instance,
                                    mobileDevice,
                                    workDate: currentWorkDate,
                                    title: 'Зоны стационарности'
                                });
                            }
                        }
                    }/>
            </>
        );
    }

    return <div className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</div>
}

export default StationaryZones;
