import React, { useCallback, useEffect, useRef, useState } from 'react';
import DataGrid, { Column, Grouping, MasterDetail, Pager, Paging, Scrolling } from 'devextreme-react/data-grid';
import { useAppData } from '../../contexts/app-data';
import { useHistory } from 'react-router-dom';
import Timelines from './timeline/timelines'
import AppConstants from '../../constants/app-constants'
import { MdMoreVert } from 'react-icons/md';
import { Button } from 'devextreme-react/ui/button';
import TrackMapPopup from './timeline/track-map-popup/track-map-popup';
import { useAppSettings } from '../../contexts/app-settings';
import { useScreenSize } from '../../utils/media-query';

import './mobile-devices.scss';
import MobileDeviceContextMenu from './mobile-devices-context-menu/mobile-device-context-menu';

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

    const showTrackMap = useCallback( ()=> {
        if (dxDataGridRef.current && dxDataGridRef.current.instance) {
            const currentRowKey = dxDataGridRef.current.instance.option('focusedRowKey');
            const mobileDevice = mobileDevices.find(md => md.id === currentRowKey);
            setCurrentMobileDevice(mobileDevice);
            setCurrentTimelineItem(getDailyTimelineItem());
        }
    }, [getDailyTimelineItem, mobileDevices]);

    const showCoveredDistance = useCallback(() => {
        if (dxDataGridRef.current && dxDataGridRef.current.instance) {
            const currentRowKey = dxDataGridRef.current.instance.option('focusedRowKey');
            const mobileDevice = mobileDevices.find(md => md.id === currentRowKey);
            history.push(`/track-sheet/${ mobileDevice.id }`);
        }
    }, [history, mobileDevices])

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
                        dataField={ 'id' }
                        caption={ 'Ид' }
                        width={ 30 }
                        visible={ false }
                        hidingPriority={ 2 }
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
                                    <div>{ !isXSmall ? 'Пользователь:' : '' }{ groupDataItem.email }</div>
                                </div>
                            );
                        } }
                        visible={ false }
                    />
                    <Column dataField={ 'deviceUid' } caption={ 'Уид устройства' } width={ 150 } allowSorting={ false } hidingPriority={ 3 }/>
                    <Column dataField={ 'model' } caption={ 'Модель' } width={ isXSmall ? '100%' : 100 } allowSorting={ false } hidingPriority={ 4 }/>
                    <Column dataField={ 'os' } caption={ 'ОС' } width={ 100 } allowSorting={ false } hidingPriority={ 2 }/>
                    <Column dataField={ 'registrationDate' } caption={ 'Регистрация' } dataType={ 'datetime' } allowSorting={ false } hidingPriority={ 1 }/>
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
                        onShowCoveredDistanceItemClick={ showCoveredDistance }/>
                    : null
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

