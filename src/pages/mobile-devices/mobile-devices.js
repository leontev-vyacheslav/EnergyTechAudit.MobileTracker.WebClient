import React, { useCallback, useEffect, useRef, useState } from 'react';
import DataGrid, { Column, Grouping, MasterDetail, Pager, Paging, Scrolling } from 'devextreme-react/data-grid';
import { useAppData } from '../../contexts/app-data';
import { useHistory } from 'react-router-dom';
import Timelines from './timeline/timelines'
import AppConstants from '../../constants/app-constants'
import { Button } from 'devextreme-react/ui/button';
import TrackMapPopup from './timeline/track-map-popup/track-map-popup';
import { useAppSettings } from '../../contexts/app-settings';
import { useScreenSize } from '../../utils/media-query';
import DataGridIconCellValueContainer from '../../components/data-grid/data-grid-icon-cell-value-container';
import moment from 'moment';
import TrackSheetPopup from '../track-sheet/track-sheet-popup/track-sheet-popup';

import MobileDeviceContextMenu from './mobile-devices-context-menu/mobile-device-context-menu';
import UserContextMenu from './user-context-menu/user-context-menu';

import { AndroidIcon, GridAdditionalMenuIcon, IosIcon, MobileDeviceIcon, RegistrationDateIcon } from '../../utils/app-icons';

import './mobile-devices.scss';
import ExtendedUserInfoPopup from './extended-user-info-popup/extended-user-info-popup';
import PageHeader from '../../components/page-header/page-header';

const MobileDevice = () => {
    const dxDataGridRef = useRef(null);
    const history = useHistory();

    const { appSettingsData, getDailyTimelineItem } = useAppSettings();
    const { getMobileDevicesAsync } = useAppData();
    const { isXSmall } = useScreenSize();
    const [mobileDevices, setMobileDevices] = useState(null);
    const [currentTimelineItem, setCurrentTimelineItem] = useState(null);
    const [currentMobileDevice, setCurrentMobileDevice] = useState(null);
    const rowContextMenuRef = useRef();
    const groupRowContextMenuRef = useRef();

    const [trackSheetPopupTrigger, setTrackSheetPopupTrigger] = useState(false);
    const [extendedUserInfoPopupTrigger, setExtendedUserInfoPopupTrigger] = useState(false);

    const showTrackMap = useCallback(() => {
        if (dxDataGridRef.current && dxDataGridRef.current.instance) {
            const currentRowKey = dxDataGridRef.current.instance.option('focusedRowKey');
            const mobileDevice = mobileDevices.find(md => md.id === currentRowKey);
            setCurrentMobileDevice(mobileDevice);
            setCurrentTimelineItem(getDailyTimelineItem());
        }
    }, [getDailyTimelineItem, mobileDevices]);

    const showTrackSheet = useCallback(() => {
        if (dxDataGridRef.current && dxDataGridRef.current.instance) {
            setTrackSheetPopupTrigger(true);
        }
    }, [])

    const showExtendedUserInfo = useCallback(() => {
        if (dxDataGridRef.current && dxDataGridRef.current.instance) {
            const currentGroupRowKey = dxDataGridRef.current.instance.option('focusedRowKey');
            const mobileDevice = mobileDevices.find(md => md.userId === currentGroupRowKey[0]);
            setCurrentMobileDevice(mobileDevice);
            setExtendedUserInfoPopupTrigger(true);
        }
    }, [mobileDevices]);

    useEffect(() => {
        ( async () => {
            const mobileDevicesData = await getMobileDevicesAsync() ?? [];
            setMobileDevices(mobileDevicesData);
        } )();
    }, [getMobileDevicesAsync, appSettingsData]);

    const GroupRowContent = ({ groupCell }) => {

        const items = groupCell.data.items === null ? groupCell.data.collapsedItems : groupCell.data.items;
        const groupDataItem = items[0];
        const userCaption = !groupDataItem.extendedUserInfo
            ? groupDataItem.email
            : `${ groupDataItem.extendedUserInfo.firstName } ${ groupDataItem.extendedUserInfo.lastName }`;
        return (
            <>
                <div className={ 'user-grid-group mobile-devices-group' }>
                    <Button className={ 'time-line-command-button' } onClick={ (e) => {
                        dxDataGridRef.current.instance.option('focusedRowKey', groupCell.key);
                        e.event.stopPropagation();
                        groupRowContextMenuRef.current.instance.option('target', e.element);
                        groupRowContextMenuRef.current.instance.show();
                    } }>
                        <GridAdditionalMenuIcon/>
                    </Button>
                    <div className={ 'dx-icon dx-icon-user' }/>
                    <div className={ 'mobile-devices-group-line' }>
                        <div>
                            <span style={ { marginRight: 10 } }>{ !isXSmall ? 'Пользователь:' : '' }</span>
                            <span>{ userCaption }</span>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (!( mobileDevices === null || mobileDevices.length === 0 )) {
        return (
            <>
                <PageHeader caption={ 'Мобильные устройства' }>
                    <MobileDeviceIcon size={ 30 }/>
                </PageHeader>
                <DataGrid ref={ dxDataGridRef }
                          keyExpr={ 'id' }
                          className={ 'mobile-devices dx-card wide-card' }
                          noDataText={ AppConstants.noDataLongText }
                          dataSource={ mobileDevices }
                          showBorders={ false }
                          focusedRowEnabled={ true }
                          showColumnHeaders={ true }
                          defaultFocusedRowIndex={ 0 }
                          columnAutoWidth={ true }
                          columnHidingEnabled={ true }
                          onRowExpanding={ (e) => {
                              e.component.collapseAll(-1);
                          } }

                >
                    <Scrolling showScrollbar={ 'never' }/>
                    <Paging defaultPageSize={ 10 }/>
                    <Pager showPageSizeSelector={ true } showInfo={ true }/>
                    <Grouping autoExpandAll={ true } key={ 'userId' }/>
                    <Column type={ 'buttons' } width={ 45 } cellRender={ () => {
                        return (
                            <Button className={ 'time-line-command-button' } onClick={ (e) => {
                                rowContextMenuRef.current.instance.option('target', e.element);
                                rowContextMenuRef.current.instance.show();
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

                    <Column dataField={ 'os' } caption={ 'ОС' } width={ 120 } allowSorting={ false } hidingPriority={ 2 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => e.data.os }
                                    iconRenderer={ (iconProps) => {
                                        return e.data.os.toLowerCase().includes('android') ? <AndroidIcon   { ...iconProps } /> : <IosIcon { ...iconProps }/>;
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
                            return <Timelines currentMobileDevice={ e.data } workDate={ appSettingsData.workDate }/>;
                        } }
                    />
                </DataGrid>

                { currentMobileDevice && currentTimelineItem !== null ?
                    <TrackMapPopup
                        mobileDevice={ currentMobileDevice }
                        timelineItem={ currentTimelineItem }
                        onClose={ () => {
                            setCurrentTimelineItem(null);
                        } }/>
                    : null
                }
                { trackSheetPopupTrigger ?
                    <TrackSheetPopup currentDate={ appSettingsData.workDate } callback={ (result) => {
                        if (result && result.modalResult === 'OK') {
                            const currentRowKey = dxDataGridRef.current.instance.option('focusedRowKey');
                            const mobileDevice = mobileDevices.find(md => md.id === currentRowKey);
                            const beginMonthDate = moment(result.parametric.currentDate).startOf('month');
                            history.push(`/track-sheet?mobileDeviceId=${ mobileDevice.id }&currentDate=${ beginMonthDate.toDate().toISOString() }`);
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
                                        if (m.userId === extendedUserInfo.id) {
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
                    <MobileDeviceContextMenu
                        ref={ rowContextMenuRef }
                        commands={
                            {
                                showTrackMap: showTrackMap,
                                showTrackSheet: showTrackSheet
                            }
                        }
                    />
                    <UserContextMenu
                        ref={ groupRowContextMenuRef }
                        commands={
                            {
                                showExtendedUserInfo: showExtendedUserInfo
                            }
                        }
                    />
                    </>
                );
    }

    return (
        <>
            <PageHeader caption={ 'Мобильные устройства' }>
                <MobileDeviceIcon size={ 30 }/>
            </PageHeader>
            <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
        </>
    );
};

export default MobileDevice;
