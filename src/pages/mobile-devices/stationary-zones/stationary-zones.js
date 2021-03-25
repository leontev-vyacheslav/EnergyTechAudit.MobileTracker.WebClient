import React, { useCallback, useEffect, useRef, useState } from 'react';
import DataGrid, {  Scrolling, Column } from 'devextreme-react/ui/data-grid';
import Button from 'devextreme-react/ui/button';
import { useAppData } from '../../../contexts/app-data';
import { useAppSettings } from '../../../contexts/app-settings';
import AppConstants from '../../../constants/app-constants';
import { DBSCAN } from 'density-clustering';
import { SphericalCalculator } from '../../../utils/spherical';
import { useJsApiLoader } from '@react-google-maps/api';
import { AccuracyIcon, AddressIcon, CountdownIcon, GridAdditionalMenuIcon, RadiusIcon, SpeedIcon } from '../../../constants/app-icons';
import DataGridIconCellValueContainer from '../../../components/data-grid-utils/data-grid-icon-cell-value-container';
import StationaryZonesRowContextMenu from '../stationary-zones-row-context-menu/stationary-zones-row-context-menu';

/*

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { exportDataGrid as exportDataGridToPdf } from 'devextreme/pdf_exporter';

*/

const StationaryZones = ({ mobileDevice }) => {
    const dataGridRef = useRef();

    /*function exportGrid() {
        const doc = new jsPDF();
        const dataGrid = dataGridRef.current.instance;

        exportDataGridToPdf({
            jsPDFDocument: doc,
            component: dataGrid
        }).then(() => {
            doc.save('Customers.pdf');
        });
    }*/

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: AppConstants.trackMap.apiKey,
        libraries: AppConstants.trackMap.libraries
    });

    const  rowContextMenuRef = useRef(null);
    const [stationaryClusterList, setStationaryClusterList] = useState([]);
    const { getLocationRecordsByRangeAsync, getGeocodedAddressesAsync } = useAppData();


    const getBoundsByMarkers = useCallback((locationList) => {
        if(isLoaded === false) return null;

        const boundBox = new window.google.maps.LatLngBounds();
        for (let i = 0; i < locationList.length; i++) {
            boundBox.extend({
                lat: locationList[i].latitude,
                lng: locationList[i].longitude
            });
        }
        return boundBox;
    }, [isLoaded]);

    const { appSettingsData : { workDate,
        stationaryZoneRadius,
        stationaryZoneElementCount,
        stationaryZoneCriteriaSpeed,
        stationaryZoneCriteriaAccuracy,
        useStationaryZoneCriteriaAccuracy,
        useStationaryZoneAddresses
    } } = useAppSettings();

    useEffect(() => {
        ( async () => {
            if (isLoaded === false) return;

            const beginDate = new Date(workDate);
            const endDate = new Date(workDate);
            endDate.setHours(24);

            let locationRecordsData = await getLocationRecordsByRangeAsync(
                mobileDevice.id,
                beginDate,
                endDate
            ) ?? [];

            const geoClusterData = locationRecordsData
                .filter(locationRecord => locationRecord.speed < stationaryZoneCriteriaSpeed &&
                ( !useStationaryZoneCriteriaAccuracy === true || locationRecord.accuracy < stationaryZoneCriteriaAccuracy )
            ).map(locationRecord => [locationRecord.latitude, locationRecord.longitude, locationRecord]);

            const dbscan = new DBSCAN();

            const clustersIndexes = dbscan.run(geoClusterData,
                stationaryZoneRadius,
                stationaryZoneElementCount,
                SphericalCalculator.computeDistanceBetween2
            );

            const geoClusters = clustersIndexes.map((clusterIndexes) => clusterIndexes.map((pointId) => geoClusterData[pointId]));

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
                let formattedAddress = [];

                if (useStationaryZoneAddresses === true) {
                    const addresses = await getGeocodedAddressesAsync({
                        latitude: centroid.getCenter().lat(),
                        longitude: centroid.getCenter().lng(),
                    });
                    if(addresses) {
                        formattedAddress = addresses
                            .filter(a => a.types.includes('street_address') || a.types.includes('premise'))
                            .map(a => a.formatted_address)
                            .filter((val, indx, arr) => arr.indexOf(val) === indx);
                    }
                    if(formattedAddress.length === 0 ) {
                        formattedAddress.push(AppConstants.noDataLongText);
                    }
                }

                clusterList.push({
                    id: index + 1,
                    index: index + 1,
                    centroid: centroid,
                    radius: radius,
                    elements: geoCluster,
                    addresses: formattedAddress,
                    speed: geoCluster
                        .map((element) => element[2].speed)
                        .reduce((acc, curr) => acc + curr) / geoCluster.length,
                    accuracy: Math.floor((geoCluster
                        .map((element) => element[2].accuracy)
                        .reduce((acc, curr) => acc + curr) / geoCluster.length) * 10 ) / 10
                })
                index++;
            }
            setStationaryClusterList(clusterList);
        } )();
    }, [getBoundsByMarkers, getGeocodedAddressesAsync, getLocationRecordsByRangeAsync, isLoaded, mobileDevice.id, stationaryZoneCriteriaAccuracy, stationaryZoneCriteriaSpeed, stationaryZoneElementCount, stationaryZoneRadius, useStationaryZoneAddresses, useStationaryZoneCriteriaAccuracy, workDate]);

    if(stationaryClusterList.length > 0) {
        return (
            <>
            <DataGrid
                className={ 'app-grid compact dx-card wide-card' }
                dataSource={ stationaryClusterList }
                ref={ dataGridRef }
                width={ '100%' }
                keyExpr={ 'id' }
                focusedRowEnabled={ true }
                showColumnLines={ true }
                showRowLines={ true }
                showBorders={ true }
                noDataText={ AppConstants.noDataLongText }>
                <Scrolling showScrollbar={ 'never' }/>
                <Column type={ 'buttons' } width={ 60 }
                        cellRender={ () => {
                            return (
                                <>
                                    <Button className={ 'app-command-button app-command-button-small' } onClick={ (e) => {
                                        if(rowContextMenuRef && rowContextMenuRef.current) {
                                            rowContextMenuRef.current.instance.option('target', e.element);
                                            rowContextMenuRef.current.instance.show();
                                        }
                                    } }>
                                        <GridAdditionalMenuIcon/>
                                    </Button>
                                </>
                            )
                        } }/>
                <Column dataField={ 'id' } dataType={ 'number' } caption={ 'Зона' } width={ 60 } alignment={ 'center' } />
                {
                    useStationaryZoneAddresses === true ?
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
                                cellDataFormatter={ () => `${ e.data.elements.length  } ` }
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
                                cellDataFormatter={ () => `${ e.data.speed < 0 ? '-' : (( e.data.speed * 3.6 * 100) / 100 ).toFixed(2) } км/ч` }
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

            <StationaryZonesRowContextMenu
                ref={ rowContextMenuRef }
                commands={
                    {
                        showTrackMap: () => { /* exportGrid() */ },
                    }
                }
            />
        </>
        );
    }

    return <div className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</div>
}

export default StationaryZones;
