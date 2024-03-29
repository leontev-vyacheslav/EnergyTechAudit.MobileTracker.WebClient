import React, { useCallback, useEffect, useRef, useState } from 'react';
import DataGrid, {
  Column,
  Grouping,
  LoadPanel,
  MasterDetail,
  Pager,
  Paging,
  Scrolling,
  SearchPanel, Toolbar
} from 'devextreme-react/data-grid';
import AppConstants from '../../constants/app-constants'
import { Button } from 'devextreme-react/button';
import TrackMapPopup from '../../components/popups/track-map-popup/track-map-popup';
import DataGridIconCellValueContainer from '../../components/data-grid-utils/data-grid-icon-cell-value-container';
import moment from 'moment';
import TrackSheetPopup from '../track-sheet/track-sheet-popup/track-sheet-popup';
import {
  AndroidIcon,
  GridAdditionalMenuIcon,
  IosIcon,
  MobileDeviceIcon,
  RegistrationDateIcon,
  UserIcon
} from '../../constants/app-icons';
import MobileDeviceRowContextMenu from './mobile-devices-row-context-menu/mobile-device-row-context-menu';
import MobileDevicesGroupRowContextMenu
  from './mobile-devices-group-row-context-menu/mobile-devices-group-row-context-menu';
import ExtendedUserInfoPopup from '../../components/popups/extended-user-info-popup/extended-user-info-popup';
import PageHeader from '../../components/page-header/page-header';
import MobileDevicesMainContextMenu from './mobile-devices-main-context-menu/mobile-devices-main-context-menu';
import { Template } from 'devextreme-react/core/template';
import MobileDevicesMasterDetailView from './mobile-devices-master-detail-view/mobile-devices-master-detail-view';
import { useAppData } from '../../contexts/app-data';
import { useHistory } from 'react-router-dom';
import { useAppSettings } from '../../contexts/app-settings';
import { useScreenSize } from '../../utils/media-query';
import {
  DataGridToolbarButton,
  onDataGridToolbarPreparing
} from '../../components/data-grid-utils/data-grid-toolbar-button';
import { mobileDeviceExcelExporter } from './mobile-devices-excel-exporter';
import './mobile-devices.scss';
import { getUserDescription } from '../../utils/string-helper';
import ContextMenu from 'devextreme-react/context-menu';
import { MobileDeviceModel } from '../../models/mobile-device';
import { TimelineModel } from '../../models/timeline';
import { ContextMenuItemItemModel } from '../../models/context-menu-item-props';
import dxDataGrid from 'devextreme/ui/data_grid';
import { Entity } from '../../models/entity';


const MobileDevice = () => {
    const dxDataGridRef = useRef<DataGrid<MobileDeviceModel, number>>(null);
    const history = useHistory();
    const { appSettingsData, getDailyTimelineItem } = useAppSettings();
    const { getMobileDevicesAsync } = useAppData();
    const { isXSmall } = useScreenSize();
    const [mobileDevices, setMobileDevices] = useState<MobileDeviceModel[] | null>(null);
    const [currentTimelineItem, setCurrentTimelineItem] = useState<TimelineModel | null>(null);
    const [currentMobileDevice, setCurrentMobileDevice] = useState<MobileDeviceModel | null>(null);
    const mainContextMenuRef = useRef<ContextMenu<ContextMenuItemItemModel>>(null);
    const groupRowContextMenuRef = useRef<ContextMenu<ContextMenuItemItemModel>>(null);
    const rowContextMenuRef = useRef<ContextMenu< ContextMenuItemItemModel>>(null);

    const [trackSheetPopupTrigger, setTrackSheetPopupTrigger] = useState<boolean>(false);
    const [extendedUserInfoPopupTrigger, setExtendedUserInfoPopupTrigger] = useState<boolean>(false);

    const showTrackMap = useCallback((e) => {
        if (dxDataGridRef.current && dxDataGridRef.current.instance) {
            const currentRowKey = dxDataGridRef.current.instance.option('focusedRowKey');
            const mobileDevice = mobileDevices?.find(md => md?.id === currentRowKey);
          if(mobileDevice) {
            if (e.event.ctrlKey === true) {
              history.push(`/track-map?mobileDeviceId=${mobileDevice.id}`);
            } else {
              setCurrentMobileDevice(mobileDevice);
              setCurrentTimelineItem(getDailyTimelineItem());
            }
          }
        }
    }, [getDailyTimelineItem, history, mobileDevices]);

    const showTrackSheet = useCallback(() => {
        if (dxDataGridRef.current && dxDataGridRef.current.instance) {
            setTrackSheetPopupTrigger(true)
        }
    }, [])

    const showExtendedUserInfo = useCallback(() => {
        if (dxDataGridRef.current && dxDataGridRef.current.instance) {

            const currentGroupRowKey = dxDataGridRef.current.instance.option('focusedRowKey');
            if (currentGroupRowKey) {
              const mobileDevice = mobileDevices?.find(md => md?.userId === (currentGroupRowKey as any)[0]);
              if (mobileDevice) {
                setCurrentMobileDevice(mobileDevice);
                setExtendedUserInfoPopupTrigger(true);
              }
            }
        }
    }, [mobileDevices]);

    const getDataAsync = useCallback(async () => {
        const mobileDevicesData = await getMobileDevicesAsync() ?? [];
        setMobileDevices(mobileDevicesData);
    }, [getMobileDevicesAsync]);

    useEffect(() => {
        ( async () => await getDataAsync() )();
    }, [getDataAsync]);

    const GroupRowContent = ({ groupCell }: { groupCell: any }) => {

        const items = groupCell.data.items === null ? groupCell.data.collapsedItems : groupCell.data.items;
        const groupDataItem = items[0];
        const userCaption = getUserDescription(groupDataItem);
        return (
            <>
                <div className={ 'user-grid-group mobile-devices-group' }>
                    <Button className={ 'app-command-button app-command-button-small' } onClick={ async e => {
                        dxDataGridRef.current?.instance.option('focusedRowKey', groupCell.key);
                        e.event?.stopPropagation();
                        if (groupRowContextMenuRef && groupRowContextMenuRef.current) {
                            groupRowContextMenuRef.current.instance.option('target', e.element);
                            await groupRowContextMenuRef.current.instance.show();
                        }
                    } }>
                        <GridAdditionalMenuIcon/>
                    </Button>
                    <DataGridIconCellValueContainer
                        rowStyle={ { gridTemplateColumns: '25px 1fr' } }
                        cellDataFormatter={ () => {
                            return userCaption;
                        } }
                        iconRenderer={ (iconProps) => {
                            return <UserIcon size={ 20 } { ...iconProps } />;
                        } }
                    />
                </div>
            </>
        );
    }

    if (!( mobileDevices === null || mobileDevices.length === 0 )) {
        return (
            <>
                <PageHeader caption={ !isXSmall ? 'Мобильные устройства' : 'Устройства' }>
                    <MobileDeviceIcon size={ AppConstants.headerIconSize }/>
                </PageHeader>
                <DataGrid
                    ref={ dxDataGridRef }
                    keyExpr={ 'id' }
                    className={ 'app-grid mobile-devices dx-card wide-card' }
                    noDataText={ AppConstants.noDataLongText }
                    dataSource={ mobileDevices }
                    showBorders={ false }
                    focusedRowEnabled={ true }
                    showColumnHeaders={ !isXSmall }
                    defaultFocusedRowIndex={ 0 }
                    columnAutoWidth={ true }
                    columnHidingEnabled={ true }
                    onToolbarPreparing={ onDataGridToolbarPreparing }
                    onRowExpanding={ (e) => {
                        e.component.collapseAll(-1);
                    } }
                    /*onInitialized={ (e) => {
                       console.log(e.component?.option('toolbar'));
                    } }*/
                >
                    <Toolbar visible={ true }/>
                    <LoadPanel enabled={ false }/>
                    <SearchPanel visible={ true } searchVisibleColumnsOnly={ false }/>
                    <Scrolling showScrollbar={ 'never' }/>
                    <Paging defaultPageSize={ 20 }/>
                    <Pager showPageSizeSelector={ true } showInfo={ true }/>
                    <Grouping autoExpandAll={ true } key={ 'userId' }/>
                    <Template name={ 'DataGridToolbarButtonTemplate' } render={ DataGridToolbarButton.bind(this, { contextMenuRef: mainContextMenuRef }) }/>
                    <Column type={ 'buttons' } width={ 45 } cellRender={ () => {
                        return (
                            <Button className={ 'app-command-button app-command-button-small' } onClick={ async e => {
                                if (rowContextMenuRef && rowContextMenuRef.current) {
                                    rowContextMenuRef.current.instance.option('target', e.element);
                                    await rowContextMenuRef.current.instance.show();
                                }
                            } }>
                                <GridAdditionalMenuIcon/>
                            </Button>
                        )
                    } }
                    />

                    <Column
                        dataField={ 'userId' }
                        groupIndex={ 0 }
                        groupCellRender={ (groupCell) => <GroupRowContent groupCell={ groupCell }/> }
                        visible={ false }
                    />

                    <Column dataField={ 'extendedUserInfo.firstName' } visible={ false }/>
                    <Column dataField={ 'extendedUserInfo.lastName' } visible={ false }/>

                    <Column dataField={ 'model' } caption={ 'Модель' } width={ isXSmall ? '100%' : 100 } allowSorting={ false } hidingPriority={ 4 }
                            cellRender={ (e) => {
                                return <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => {
                                        return e.data.model;
                                    } }
                                    iconRenderer={ (iconProps) => {
                                        return <MobileDeviceIcon { ...iconProps } />;
                                    } }
                                />
                            } }
                    />

                    <Column dataField={ 'os' } caption={ 'ОС' } width={ 135 } allowSorting={ false } hidingPriority={ 2 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => e.data.os }
                                    iconRenderer={ (iconProps) => {
                                        return e.data.os.toLowerCase().includes('android') ? <AndroidIcon    { ...iconProps } /> : <IosIcon { ...iconProps }/>;
                                    } }
                                />
                            }
                    />

                    <Column dataField={ 'registrationDate' } caption={ 'Регистрация' } dataType={ 'datetime' } allowSorting={ false } hidingPriority={ 1 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => new Date(e.data.registrationDate).toLocaleDateString('ru-RU') }
                                    iconRenderer={ (iconProps) => <RegistrationDateIcon { ...iconProps } /> }
                                />
                            }
                    />

                    <MasterDetail
                        enabled={ true }
                        render={ (e) => {
                            return <MobileDevicesMasterDetailView mobileDevice={ e.data }/>;
                        } }
                    />
                </DataGrid>

                { currentMobileDevice && currentTimelineItem !== null ?
                    <TrackMapPopup
                        mobileDevice={ currentMobileDevice }
                        callback={ () => {
                            setCurrentTimelineItem(null);
                        } }/>
                    : null
                }
                { trackSheetPopupTrigger ?
                    <TrackSheetPopup currentDate={ appSettingsData.workDate } callback={ (result) => {
                        if (result && result.modalResult === 'OK') {
                            const currentRowKey = dxDataGridRef.current?.instance.option('focusedRowKey');
                            const mobileDevice = mobileDevices.find(md => md?.id === currentRowKey);
                            if (mobileDevice) {
                              const beginMonthDate = moment(result.parametric.currentDate).startOf('month');
                              history.push(`/track-sheet?mobileDeviceId=${mobileDevice.id}&currentDate=${beginMonthDate.toDate().toISOString()}`);
                            }
                        }
                        setTrackSheetPopupTrigger(false);
                    } }/> : null
                }
                { currentMobileDevice !== null && extendedUserInfoPopupTrigger
                    ? <ExtendedUserInfoPopup userId={ currentMobileDevice.userId } callback={ async (result) => {
                        if (result && result.modalResult === 'OK') {
                            const extendedUserInfo = result.data;
                            if (extendedUserInfo) {
                                const updatedMobileDevices = mobileDevices
                                    .map(m => {
                                        if ( m && m.userId === extendedUserInfo.id) {
                                            return { ...m, ...{ extendedUserInfo: extendedUserInfo } }
                                        }
                                        return m;
                                    });
                                setMobileDevices(updatedMobileDevices);
                            }
                        }
                        setExtendedUserInfoPopupTrigger(false);
                    }
                    }/>
                    : null
                }
                <MobileDevicesMainContextMenu
                    ref={ mainContextMenuRef }
                    commands={
                        {
                            refresh: getDataAsync,
                            exportToXlsx: () => {
                              if (dxDataGridRef.current) {
                                mobileDeviceExcelExporter({
                                  dataGrid: dxDataGridRef.current.instance as unknown as dxDataGrid<Entity, number>,
                                  title: 'Мобильные устройства'
                                })
                              }
                            }
                        }
                    }/>
                <MobileDevicesGroupRowContextMenu
                    ref={ groupRowContextMenuRef }
                    commands={
                        {
                            showExtendedUserInfo: showExtendedUserInfo
                        }
                    }
                />
                <MobileDeviceRowContextMenu
                    ref={ rowContextMenuRef }
                    commands={
                        {
                            showTrackMap: showTrackMap,
                            showTrackSheet: showTrackSheet
                        }
                    }
                />
            </>
        );
    }

    return (
        <>
            <PageHeader caption={ !isXSmall ? 'Мобильные устройства' : 'Устройства' }>
                <MobileDeviceIcon size={ AppConstants.headerIconSize }/>
            </PageHeader>
            <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
        </>
    );
};

export default MobileDevice;
