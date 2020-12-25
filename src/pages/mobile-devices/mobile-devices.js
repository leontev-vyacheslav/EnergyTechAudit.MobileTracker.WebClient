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
import MobileDeviceContextMenu from './mobile-devices-context-menu/mobile-device-context-menu';
import DataGridIconCellValueContainer from '../../components/data-grid/data-grid-icon-cell-value-container';

import { RiCalendarCheckFill } from 'react-icons/ri';
import { MdAndroid, MdMoreVert, MdSmartphone } from 'react-icons/md';
import { SiIos } from 'react-icons/si';

import './mobile-devices.scss';
import TrackSheetPopup from '../track-sheet/track-sheet-popup/track-sheet-popup';
import moment from 'moment';

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

    const [trackSheetPopupTrigger, setTrackSheetPopupTrigger] = useState(false);

    const showTrackMap = useCallback( ()=> {
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

    useEffect(() => {
        ( async () => {
            const mobileDevicesData = await getMobileDevicesAsync() ?? [];
            setMobileDevices(mobileDevicesData);
        } )();
    }, [getMobileDevicesAsync, appSettingsData]);

    if (!( mobileDevices === null || mobileDevices.length === 0 )) {
        return (
            <>
                <h2 className={ 'content-block' }>Мобильные устройства</h2>
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
                    <Column type={ 'buttons' } width={ 50 } cellRender={ () => {
                        const buttonIconProps = { style: { cursor: 'pointer' }, size: 18, color: '#464646' };
                        return (
                            <Button className={ 'time-line-command-button' } onClick={ (e) => {
                                rowContextMenuRef.current.instance.option('target', e.element);
                                rowContextMenuRef.current.instance.show();
                            } }>
                                <MdMoreVert { ...buttonIconProps } />
                            </Button>
                        )
                    } }
                    />
                    <Column
                        dataField={ 'userId' }
                        groupIndex={ 0 }
                        groupCellRender={ (template) => {
                            const items = template.data.items === null ? template.data.collapsedItems : template.data.items;
                            const groupDataItem = items[0];
                            return (
                                <div className={ 'mobile-devices-group' }>
                                    <div className={ 'dx-icon dx-icon-user' }/>
                                    <div className={ 'mobile-devices-group-line' }>
                                        <div>
                                            <span style={ { marginRight: 10 } }>{ !isXSmall ? 'Пользователь:' : '' }</span>
                                            <span>{ groupDataItem.email }</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        } }
                        visible={ false }
                    />

                    <Column dataField={ 'model' } caption={ 'Модель' } width={ isXSmall ? '100%' : 100 } allowSorting={ false } hidingPriority={ 4 }
                            cellRender={ (e) => {
                                return <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => {
                                        return e.data.model;
                                    } }
                                    iconRenderer={ (iconProps) => {
                                        return <MdSmartphone { ...iconProps } />;
                                    } }
                                />
                            } }
                    />

                    <Column dataField={ 'os' } caption={ 'ОС' } width={ 120 } allowSorting={ false } hidingPriority={ 2 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => e.data.os }
                                    iconRenderer={ (iconProps) => {
                                        return e.data.os.toLowerCase().includes('android') ? <MdAndroid   { ...iconProps } /> : <SiIos { ...iconProps }/>;
                                    } }
                                />
                            }
                    />

                    <Column dataField={ 'registrationDate' } caption={ 'Регистрация' } dataType={ 'datetime' } allowSorting={ false } hidingPriority={ 1 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => new Date(e.data.registrationDate).toLocaleDateString('ru-RU') }
                                    iconRenderer={ (iconProps) => <RiCalendarCheckFill { ...iconProps } /> }
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
                        onHiding={ () => {
                            setCurrentTimelineItem(null);
                        } }/>
                    : null
                }
                { currentTimelineItem === null ?
                    <MobileDeviceContextMenu
                        ref={ rowContextMenuRef }
                        onShowTrackMapItemClick={ showTrackMap }
                        onShowCoveredDistanceItemClick={ showTrackSheet }/>
                    : null
                }
                { trackSheetPopupTrigger ?
                    <TrackSheetPopup currentDate={ appSettingsData.workDate } callback={ (result) => {
                        if(result && result.modalResult === 'OK') {
                            const currentRowKey = dxDataGridRef.current.instance.option('focusedRowKey');
                            const mobileDevice = mobileDevices.find(md => md.id === currentRowKey);
                            const beginMonthDate = moment(result.parametric.currentDate).startOf('month');
                            history.push(`/track-sheet?mobileDeviceId=${ mobileDevice.id }&currentDate=${beginMonthDate.toDate().toISOString()}`);
                        }
                        setTrackSheetPopupTrigger(false);
                    } }/> : null
                }
            </>
        );
    }

    return (
        <>
            <h2 className={ 'content-block' }>Мобильные устройства</h2>
            <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
        </>
    );
};

export default MobileDevice;

