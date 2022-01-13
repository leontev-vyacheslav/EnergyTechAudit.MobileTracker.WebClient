import React, { useEffect, useRef, useState } from 'react';
import {  useAppData } from '../../../contexts/app-data';
import { useAppSettings } from '../../../contexts/app-settings';
import AppConstants from '../../../constants/app-constants';
import DataGrid, { Column, LoadPanel, Scrolling } from 'devextreme-react/ui/data-grid';
import {
    DataGridToolbarButton,
    onDataGridToolbarPreparing
} from '../../../components/data-grid-utils/data-grid-toolbar-button';
import { Template } from 'devextreme-react/core/template';
import { Pager, Paging } from 'devextreme-react/data-grid';
import DataGridIconCellValueContainer from '../../../components/data-grid-utils/data-grid-icon-cell-value-container';
import { stationaryZonesExcelExporter } from '../stationary-zones/stationary-zones-excel-exporter';
import StationaryZoneMainContextMenu
    from '../stationary-zones/stationary-zones-main-context-menu/stationary-zones-main-context-menu';
import {
    BackgroundGeolocationOffIcon,
    BackgroundGeolocationOnIcon,
    BackgroundGeolocationUndefinedIcon,
    BatteryLevelIcon,
    BeginDateIcon,
    LocationDisabledIcon,
    LocationEnabledIcon,
    LowPowerModeDisabledIcon,
    LowPowerModeEnabledIcon
} from '../../../constants/app-icons';
import { MobileDeviceWorkDateModel } from '../../../models/mobile-device-work-date-model';
import { MobileDeviceBackgroundStatusModel } from '../../../models/mobile-device-background-status-model';

const BackgroundStatuses = ({ mobileDevice, workDate }: MobileDeviceWorkDateModel) => {

    const { getMobileDeviceBackgroundStatusListAsync } = useAppData();
    const {
        appSettingsData: {
            workDate: appSettingsWorkDate,
        }
    } = useAppSettings();
    const [backgroundStatusList, setBackgroundStatusList] = useState<MobileDeviceBackgroundStatusModel[] | null>([]);
    const [currentWorkDate] = useState(workDate ?? appSettingsWorkDate);
    const dxDataGridRef = useRef<DataGrid<MobileDeviceBackgroundStatusModel, number>>(null);
    const mainContextMenuRef = useRef(null);

    useEffect(() => {
        (async () => {
            const beginDate = new Date(currentWorkDate),
                endDate = new Date(currentWorkDate);
            endDate.setHours(24);

            if (mobileDevice) {
                const backgroundStatuses = await getMobileDeviceBackgroundStatusListAsync(mobileDevice.id, beginDate, endDate);
                setBackgroundStatusList(backgroundStatuses);
            }
        })();
    }, [currentWorkDate, getMobileDeviceBackgroundStatusListAsync, mobileDevice])

    if (backgroundStatusList && backgroundStatusList.length > 0) {
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

                    <Column dataField={ 'geoTrackingEnabled' } dataType={ 'datetime' } hidingPriority={ 4 } caption={ 'Включение' } width={ 150 }
                            cellRender={ (e) =>
                            {
                                const status = !e.data.statusInfo.appBackgroundGeolocationSettings
                                    ? 'Неопределено'
                                    : (e.data.statusInfo.appBackgroundGeolocationSettings.geoTrackingEnabled === true ? 'Включено' : 'Выключено');

                                return <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => `${ status }` }
                                    iconRenderer={ (iconProps) => status === 'Включено'
                                        ?  <BackgroundGeolocationOnIcon { ...iconProps } />
                                        : (status === 'Неопределено' ? <BackgroundGeolocationUndefinedIcon { ...iconProps } /> : <BackgroundGeolocationOffIcon { ...iconProps } /> )
                                    }
                                />
                            } }
                    />

                    <Column dataField={ 'isLocationEnabled' } dataType={ 'boolean' } caption={ 'Геолокации' } width={ 135 } alignment={ 'left' } hidingPriority={ 4 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => `${ e.data.statusInfo.isLocationEnabled === true ? 'Разрешены' : 'Запрещены' } ` }
                                    iconRenderer={ (iconProps) => e.data.statusInfo.isLocationEnabled === true ? <LocationEnabledIcon { ...iconProps } />  : <LocationDisabledIcon { ...iconProps } /> }
                                /> }
                    />

                    <Column dataField={ 'batteryLevel' } dataType={ 'numeric' } caption={ 'Батарея' } width={ 120 } alignment={ 'left' } hidingPriority={ 1 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => `${(e.data.statusInfo.powerState.batteryLevel * 100).toFixed(1)} %` }
                                    iconRenderer={ (iconProps) =>   <BatteryLevelIcon { ...iconProps } />  }
                                /> }
                    />

                    <Column dataField={ 'lowPowerMode' } dataType={ 'boolean' } caption={ 'Энергосбережение' } width={ 120 } alignment={ 'left' } hidingPriority={ 1 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => `${ e.data.statusInfo.powerState.lowPowerMode === true ? 'Разрешено' : 'Запрещено'} ` }
                                    iconRenderer={ (iconProps) =>  e.data.statusInfo.powerState.lowPowerMode === true ? <LowPowerModeEnabledIcon { ...iconProps } /> : <LowPowerModeDisabledIcon { ...iconProps } /> }
                                /> }
                    />
                </DataGrid>
                <StationaryZoneMainContextMenu
                  ref={ mainContextMenuRef }
                  commands={ {
                      exportToXlsx: () => {
                          if (dxDataGridRef.current) {
                              stationaryZonesExcelExporter({
                                  dataGrid: dxDataGridRef.current.instance,
                                  mobileDevice,
                                  workDate: currentWorkDate,
                                  title: 'Зоны стационарности'
                              });
                          }
                      }
                  }
                  } />
            </>
        );
    }

    return <div className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</div>
}

export default BackgroundStatuses;
