import React, { useEffect, useRef, useState } from 'react';
import DataGrid, { Column, Grouping, MasterDetail, Pager, Paging, Scrolling } from 'devextreme-react/data-grid';
import { useAppData } from '../../contexts/app-data';
import AppConstants from '../../constants/app-constants'
import SideNavigationMenu from '../../components/side-navigation-menu/side-navigation-menu';
import { useParams } from 'react-router';
import { Button } from 'devextreme-react/ui/button';
import Timelines from '../mobile-devices/timeline/timelines';
import TrackSheetContextMenu from './track-sheet-context-menu'
import { useScreenSize } from '../../utils/media-query';
import TrackMapPopup from '../mobile-devices/timeline/track-map-popup/track-map-popup';
import { useAppSettings } from '../../contexts/app-settings';
import DataGridIconCellValueContainer from '../../components/data-grid/data-grid-icon-cell-value-container';

import { MdTimeline, RiCalendarEventFill } from 'react-icons/all';
import { MdMoreVert } from 'react-icons/md';

const TrackSheet = () => {
    const dxDataGridRef = useRef(null);
    const { isXSmall } = useScreenSize();
    const { appSettingsData, getDailyTimelineItem } = useAppSettings();
    const { getMobileDeviceAsync, getTrackSheetAsync } = useAppData();
    const [trackSheet, setTrackSheet] = useState(null);
    const [currentMobileDevice, setCurrentMobileDevice] = useState(null);
    const [currentTimelineItem, setCurrentTimelineItem] = useState(null);
    const [currentDate, setCurrentDate] = useState(null);
    const rowContextMenuRef = useRef();

    let { mobileDeviceId } = useParams();

    useEffect(() => {
        ( async () => {
            const mobileDevice = await getMobileDeviceAsync(mobileDeviceId);
            setCurrentMobileDevice(mobileDevice);
            let trackSheet = await getTrackSheetAsync(mobileDeviceId);
            if (trackSheet && trackSheet.dailyCoveredDistances) {
                trackSheet.dailyCoveredDistances = trackSheet.dailyCoveredDistances.map(ts => {
                    return { ...ts, ...{ userId: mobileDevice.userId, mobileDeviceId: mobileDevice.id } }
                });
                setTrackSheet(trackSheet);
            }
        } )();
    }, [getMobileDeviceAsync, getTrackSheetAsync, mobileDeviceId, appSettingsData]);

    SideNavigationMenu.treeViewRef?.current?.instance.unselectAll();

    if (trackSheet !== null && trackSheet.length !== 0 && currentMobileDevice) {
        return (
            <>
            <h2 className={ 'content-block' }>Путевой отчет</h2>
            <DataGrid ref={ dxDataGridRef }
                      keyExpr={ 'id' }
                      className={ 'mobile-devices dx-card wide-card' }
                      noDataText={ AppConstants.noDataLongText }
                      dataSource={ trackSheet.dailyCoveredDistances }
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

                <Column
                    dataField={ 'userId' }
                    groupIndex={ 0 }
                    groupCellRender={ () => {
                        return (
                            <div className={ 'mobile-devices-group' }>
                                <div className={ 'dx-icon dx-icon-user' }/>
                                <div>
                                    <div className={ 'mobile-devices-group-line' }>
                                        <div>
                                            <span style={ { marginRight: 10 } }>{ !isXSmall ? 'Пользователь:' : '' }</span>
                                            <span>{ currentMobileDevice.email } / { currentMobileDevice.model }</span>
                                        </div>
                                    </div>
                                    <div className={ 'mobile-devices-group-line' }>
                                            <span>Всего пройдено за период: <code style={ {
                                                borderRadius: 5,
                                                padding: '3px 12px',
                                                letterSpacing: 1,
                                                color: '#f2f2f2',
                                                backgroundColor: '#ff5722'
                                            } }>{ ( trackSheet.totalCoveredDistance / 1000 ).toFixed(2) } км</code></span>
                                    </div>
                                </div>
                            </div>
                        );
                    } }
                visible={ false }
            />

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

            <Column dataField={ 'id' } caption={ 'День' } width={ 60 } hidingPriority={ 2 } visible={ false }/>

            <Column dataField={ 'date' } caption={ 'Дата' } width={ 150 } dataType={ 'date' } alignment={ 'left' } allowSorting={ false } hidingPriority={ 3 }
                    cellRender={ (e) => <DataGridIconCellValueContainer
                        cellDataFormatter={ () => new Date(e.data.date).toLocaleDateString('ru-RU') }
                        iconRenderer={ (iconProps) => <RiCalendarEventFill   { ...iconProps } /> }
                    />
                    }
            />

            <Column dataField={ 'distance' } caption={ 'Расстояние, км' } width={ 150 } alignment={ 'left' } hidingPriority={ 4 }
                    cellRender={ (e) => <DataGridIconCellValueContainer
                        cellDataFormatter={ () => ( e.data.distance / 1000 ).toFixed(2) }
                        iconRenderer={ (iconProps) => <MdTimeline   { ...iconProps } /> }
                    />
                    }
            />

            <Column dataField={ 'samplesNumber' } caption={ 'Отсчеты' } alignment={ 'left' } hidingPriority={ 1 }/>

            <MasterDetail
                enabled={ true }
                render={ (e) => {
                    return <Timelines currentMobileDevice={ currentMobileDevice } workDate={ e.data.date }/>;
                } }
            />
            </DataGrid>

        <TrackSheetContextMenu ref={ rowContextMenuRef } onShowTrackMapItemClick={ () => {
            if (dxDataGridRef.current && dxDataGridRef.current.instance) {
                const currentRowKey = dxDataGridRef.current.instance.option('focusedRowKey');
                const currentDailyCoveredDistanceItem = trackSheet.dailyCoveredDistances.find(ts => ts.id === currentRowKey);
                setCurrentDate(currentDailyCoveredDistanceItem.date)
                setCurrentTimelineItem(getDailyTimelineItem(currentDailyCoveredDistanceItem.date));
            }
        } }/>
    { currentMobileDevice && currentTimelineItem !== null ?
        <TrackMapPopup
            mobileDevice={ currentMobileDevice }
            timelineItem={ currentTimelineItem }
            initialDate={ currentDate }
            onHiding={ () => {
                setCurrentTimelineItem(null);
            } }/>
        : null
    }
    </>
    )
        ;
    }

    return (
        <>
            <h2 className={ 'content-block' }>Путевой отчет</h2>
            <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
        </>
    );
};

export default TrackSheet;
