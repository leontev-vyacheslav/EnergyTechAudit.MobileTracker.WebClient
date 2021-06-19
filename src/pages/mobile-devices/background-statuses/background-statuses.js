import React, { useEffect, useRef, useState } from 'react';
import { useAppData } from '../../../contexts/app-data';
import { useAppSettings } from '../../../contexts/app-settings';
import AppConstants from '../../../constants/app-constants';
import DataGrid, { Column, LoadPanel, Scrolling } from 'devextreme-react/ui/data-grid';
import { DataGridToolbarButton, onDataGridToolbarPreparing } from '../../../components/data-grid-utils/data-grid-toolbar-button';
import { Template } from 'devextreme-react/core/template';
import { Pager, Paging } from 'devextreme-react/data-grid';
import DataGridIconCellValueContainer from '../../../components/data-grid-utils/data-grid-icon-cell-value-container';
import { stationaryZonesExcelExporter } from '../stationary-zones/stationary-zones-excel-exporter';
import StationaryZoneMainContextMenu from '../stationary-zones/stationary-zones-main-context-menu/stationary-zones-main-context-menu';
import { BeginDateIcon, LocationDisabledIcon, LocationEnabledIcon, LowPowerModeDisabled, LowPowerModeEnabled, MemoryIcon } from '../../../constants/app-icons';

const BackgroundStatuses = ({ mobileDevice, workDate }) => {

    const { getMobileDeviceBackgroundStatusListAsync } = useAppData();
    const {
        appSettingsData: {
            workDate: appSettingsWorkDate,
        }
    } = useAppSettings();

    const [backgroundStatusList, setBackgroundStatusList] = useState([]);
    const [currentWorkDate] = useState(workDate ?? appSettingsWorkDate);

    const dxDataGridRef = useRef();
    const mainContextMenuRef = useRef(null);

    useEffect(() => {
        (async () => {
            const beginDate = new Date(currentWorkDate),
                endDate = new Date(currentWorkDate);
            endDate.setHours(24);

            const backgroundStatuses = await getMobileDeviceBackgroundStatusListAsync(mobileDevice.id, beginDate, endDate);

            setBackgroundStatusList(backgroundStatuses);

        })();
    }, [currentWorkDate, getMobileDeviceBackgroundStatusListAsync, mobileDevice.id])

    if (backgroundStatusList.length > 0) {
        return (
            <>
                <DataGrid
                    className={ 'app-grid compact app-grid-detail dx-card wide-card' }
                    dataSource={ backgroundStatusList }
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

                    <Pager allowedPageSizes={ [5, 10] } showPageSizeSelector={ true }  />
                    <Paging defaultPageSize={ 5 } />
                    <Column dataField={ 'id' } dataType={ 'number' } caption={ 'Статус' } width={ 60 } alignment={ 'center' } visible={ false }/>

                    <Column dataField={ 'mobileDeviceDateTime' } dataType={ 'datetime' } sortOrder={ 'desc' } hidingPriority={ 3 } caption={ 'Время' } width={ 180 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => `${ new Date(e.data.mobileDeviceDateTime).toLocaleDateString('ru-RU', { hour: 'numeric', minute: 'numeric' }) }` }
                                    iconRenderer={ (iconProps) => <BeginDateIcon { ...iconProps } /> }
                                />
                            }
                    />

                    <Column dataField={ 'isLocationEnabled' } dataType={ 'boolean' } caption={ 'Геолокации' } width={ 135 } alignment={ 'left' } hidingPriority={ 4 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => `${ e.data.statusInfo.isLocationEnabled === true ? 'Разрешены' : 'Запрещены' } ` }
                                    iconRenderer={ (iconProps) => e.data.statusInfo.isLocationEnabled === true ? <LocationEnabledIcon { ...iconProps } />  : <LocationDisabledIcon { ...iconProps } /> }
                                /> }
                    />

                    <Column dataField={ 'usedMemory' } dataType={ 'boolean' } caption={ 'Память' } width={ 120 } alignment={ 'left' } hidingPriority={ 2 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => `${ e.data.statusInfo.usedMemory } ` }
                                    iconRenderer={ (iconProps) => <MemoryIcon { ...iconProps } /> }
                                /> }
                    />
                    <Column dataField={ 'lowPowerMode' } dataType={ 'numeric' } caption={ 'Энергосбережение' } width={ 120 } alignment={ 'left' } hidingPriority={ 1 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => `${ e.data.statusInfo.powerState.lowPowerMode === true ? 'Разрешено' : 'Запрещено'} ` }
                                    iconRenderer={ (iconProps) =>  e.data.statusInfo.powerState.lowPowerMode === true ? <LowPowerModeEnabled { ...iconProps } /> : <LowPowerModeDisabled { ...iconProps } /> }
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

export default BackgroundStatuses;
