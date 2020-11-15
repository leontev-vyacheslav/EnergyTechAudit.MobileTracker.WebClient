import React, { useEffect, useState } from 'react';
import DataGrid, { Column, Pager, Paging, Grouping, Scrolling, MasterDetail } from 'devextreme-react/data-grid';
import { useAppData } from '../../contexts/app-data';
import Timelines from './timeline/timelines'
import AppConstants from '../../constants/app-constants'
import { MdMap } from 'react-icons/md';
import Loader from '../../components/loader/loader';

import './mobile-devices.scss';
import { Button } from 'devextreme-react/ui/button';
import TrackMapPopup from './timeline/track-map-popup/track-map-popup';
import { useAppSettings } from '../../contexts/app-settings';

const MobileDevice = () => {
    const { appSettingsData } = useAppSettings();
    const { getMobileDevices } = useAppData({});

    const [mobileDevices, setMobileDevices] = useState(null);
    const [isDelayComplete, setIsDelayComplete] = useState(true);
    const [currentTimelineItem, setCurrentTimelineItem] = useState(null);
    const [currentMobileDevice, setCurrentMobileDevice] = useState(null);

    setTimeout(() => {
        setIsDelayComplete(true);
    }, AppConstants.loadingDelay);

    useEffect(() => {
        ( async () => {
            const mobileDevicesData = await getMobileDevices();
            setMobileDevices(mobileDevicesData);
        } )();
    }, [getMobileDevices]);

    let content;
    if (mobileDevices === null || !isDelayComplete) {
        content = <Loader/>;
    } else if (mobileDevices.length === 0) {
        content = (
            <>
                <h2 className={ 'content-block' }>Мобильные устройства</h2>
                <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
            </>
        );
    } else {
        content = (
            <>
                <h2 className={ 'content-block' }>Мобильные устройства</h2>
                <DataGrid
                    keyExpr={ 'id' }
                    className={ 'mobile-devices dx-card wide-card' }
                    noDataText={ AppConstants.noDataLongText }
                    dataSource={ mobileDevices }
                    showBorders={ false }
                    focusedRowEnabled={ true }
                    showColumnHeaders={ false }
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
                    <Column type={ 'buttons' } width={ 85 } cellRender={ (e) => {
                        const rowData = e.data;
                        const buttonIconProps = { style: { cursor: 'pointer' }, size: 16, color: '#464646' };
                        return (
                            <>
                                <Button className={ 'time-line-command-button' } style={ {} } onClick={ () => {
                                    const mobileDevice = rowData;
                                    const beginDate = new Date(appSettingsData.workDate);
                                    const endDate = new Date(appSettingsData.workDate);
                                    endDate.setHours(24);

                                    setCurrentMobileDevice(mobileDevice);
                                    setCurrentTimelineItem({ id: 0, beginDate: beginDate.toISOString(), endDate: endDate.toISOString() });
                                } }>
                                    <MdMap { ...buttonIconProps } />
                                </Button>
                            </>
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
                                    <div>
                                        <div>Пользователь: { groupDataItem.userName }</div>
                                        <div>{ groupDataItem.email }</div>
                                    </div>
                                </div>
                            );
                        } }
                        visible={ false }
                    />
                    <Column dataField={ 'deviceUid' } caption={ 'Уид устройства' } width={ 150 } allowSorting={ false } hidingPriority={ 3 }/>
                    <Column dataField={ 'model' } caption={ 'Модель' } width={ 100 } allowSorting={ false } hidingPriority={ 4 }/>
                    <Column dataField={ 'os' } caption={ 'ОС' } width={ 100 } allowSorting={ false } hidingPriority={ 2 }/>
                    <Column dataField={ 'registrationDate' } caption={ 'Регистрация' } dataType={ 'datetime' } allowSorting={ false } hidingPriority={ 1 }/>
                    <MasterDetail
                        enabled={ true }
                        render={ (e) => {
                            return <Timelines currentMobileDevice={ e.data }/>;
                        } }
                    />
                </DataGrid>
                { currentTimelineItem !== null ?
                    <TrackMapPopup
                        mobileDevice={ currentMobileDevice }
                        timeline={ null }
                        timelineItem={ currentTimelineItem }
                        onHiding={ () => {
                            setCurrentTimelineItem(null);
                        } }/>
                    : null
                }
            </>
        );
    }
    return content;
};

export default MobileDevice;


