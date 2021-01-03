import React, { useEffect, useRef, useState } from 'react';
import DataGrid, { Column, Grouping, MasterDetail, Pager, Paging, Scrolling } from 'devextreme-react/data-grid';
import { useAppData } from '../../contexts/app-data';
import AppConstants from '../../constants/app-constants'
import SideNavigationMenu from '../../components/side-navigation-menu/side-navigation-menu';
import { useLocation } from 'react-router';
import { Button } from 'devextreme-react/ui/button';
import Timelines from '../mobile-devices/timeline/timelines';
import TrackSheetContextMenu from './track-sheet-context-menu'
import { useScreenSize } from '../../utils/media-query';
import TrackMapPopup from '../mobile-devices/timeline/track-map-popup/track-map-popup';
import { useAppSettings } from '../../contexts/app-settings';
import DataGridIconCellValueContainer from '../../components/data-grid/data-grid-icon-cell-value-container';
import { AccuracyIcon, CurrentDateIcon, DistanceIcon, GridAdditionalMenuIcon, TimelineIcon } from '../../utils/app-icons';

import './track-sheet.scss';
import PageHeader from '../../components/page-header/page-header';

const TrackSheet = () => {
    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    let query = useQuery();

    const dxDataGridRef = useRef(null);
    const { isXSmall } = useScreenSize();
    const { appSettingsData, getDailyTimelineItem } = useAppSettings();
    const { getMobileDeviceAsync, getTrackSheetAsync } = useAppData();
    const [trackSheet, setTrackSheet] = useState(null);
    const [currentMobileDevice, setCurrentMobileDevice] = useState(null);
    const [currentTimelineItem, setCurrentTimelineItem] = useState(null);

    const [trackMapCurrentDate, setTrackMapCurrentDate] = useState(null);
    const rowContextMenuRef = useRef();

    const [currentMobileDeviceId] = useState(query.get('mobileDeviceId'));
    const [currentDate] = useState(query.get('currentDate'));

    useEffect(() => {
        ( async () => {
            if (currentDate) {
                const mobileDevice = await getMobileDeviceAsync(currentMobileDeviceId);
                setCurrentMobileDevice(mobileDevice);

                let trackSheet = await getTrackSheetAsync(currentMobileDeviceId, currentDate);
                if (trackSheet && trackSheet.dailyCoveredDistances) {
                    trackSheet.dailyCoveredDistances = trackSheet.dailyCoveredDistances.map(ts => {
                        return { ...ts, ...{ userId: mobileDevice.userId, mobileDeviceId: mobileDevice.id } }
                    });
                    setTrackSheet(trackSheet);
                }
            }
        } )();
    }, [getMobileDeviceAsync, getTrackSheetAsync, currentMobileDeviceId, appSettingsData, currentDate]);

    SideNavigationMenu.treeViewRef?.current?.instance.unselectAll();

    const GroupRowContent = () => {
        const userCaption = !currentMobileDevice.extendedUserInfo
            ? currentMobileDevice.email
            : `${ currentMobileDevice.extendedUserInfo.firstName } ${ currentMobileDevice.extendedUserInfo.lastName }`;
        return (
            <div className={ 'user-grid-group track-sheet-group ' }>
                <div className={ 'dx-icon dx-icon-user' }/>
                <div style={ { display: 'grid', gap: 5 } }>
                    <div className={ 'mobile-devices-group-line' }>
                        <div>
                            <span>{ !isXSmall ? 'Пользователь: ' : '' }</span>
                            <span>{ userCaption } / { currentMobileDevice.model }</span>
                        </div>
                    </div>
                    <div className={ 'mobile-devices-group-line' }>
                        <span>{ !isXSmall ? 'Всего пройдено за период:' : null }
                            <code className={ 'badge badge-important' }>{ ( trackSheet.totalCoveredDistance / 1000 ).toFixed(2) } км</code>
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    if (currentDate && trackSheet !== null && trackSheet.length !== 0 && currentMobileDevice) {
        return (
            <>
                <PageHeader caption={ 'Путевой отчет' }>
                    <TimelineIcon size={ 30 }/>
                </PageHeader>
                <DataGrid ref={ dxDataGridRef }
                          keyExpr={ 'id' }
                          className={ 'mobile-devices track-sheet dx-card wide-card' }
                          noDataText={ AppConstants.noDataLongText }
                          dataSource={ trackSheet?.dailyCoveredDistances ?? [] }
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
                    <Paging defaultPageSize={ isXSmall ? 5 : 10 }/>
                    <Pager showPageSizeSelector={ true } showInfo={ true }/>
                    <Grouping autoExpandAll={ true } key={ 'userId' }/>

                    <Column
                        dataField={ 'userId' }
                        groupIndex={ 0 }
                        groupCellRender={ () => <GroupRowContent /> }
                        visible={ false }
                    />

                    <Column type={ 'buttons' } width={ 50 } cellRender={ () => {
                        return (
                            <Button className={ 'time-line-command-button' } onClick={ (e) => {
                                rowContextMenuRef.current.instance.option('target', e.element);
                                rowContextMenuRef.current.instance.show();
                            } }>
                                <GridAdditionalMenuIcon  />
                            </Button>
                        )
                    } }
                    />

                    <Column dataField={ 'id' } caption={ 'День' } width={ 60 } hidingPriority={ 3 } visible={ false }/>

                    <Column dataField={ 'date' } caption={ 'Дата' } width={ 125 } dataType={ 'date' } alignment={ 'left' } allowSorting={ false }
                            hidingPriority={ 2 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => new Date(e.data.date).toLocaleDateString('ru-RU') }
                                    iconRenderer={ (iconProps) => <CurrentDateIcon   { ...iconProps } /> }
                                />
                            }
                    />

                    <Column dataField={ 'distance' } caption={ 'Расстояние, км' } width={ 125 } alignment={ 'left' } hidingPriority={ 4 }
                            cellRender={ (e) => <DataGridIconCellValueContainer
                                cellDataFormatter={ () => `${ ( e.data.distance / 1000 ).toFixed(2) } км` }
                                iconRenderer={ (iconProps) => <DistanceIcon   { ...iconProps } /> }
                            />
                            }
                    />

                    <Column dataField={ 'averageAccuracy' } caption={ 'Средняя точность отсчетов, м' } width={ 125 } alignment={ 'left' } hidingPriority={ 1 }
                            cellRender={ (e) => <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => `${ ( e.data.averageAccuracy ).toFixed(2) } м` }
                                    iconRenderer={ (iconProps) => <AccuracyIcon { ...iconProps } /> }
                                />
                            }
                    />
                    <Column />

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
                        setTrackMapCurrentDate(currentDailyCoveredDistanceItem.date)
                        setCurrentTimelineItem(getDailyTimelineItem(currentDailyCoveredDistanceItem.date));
                    }
                } }/>
                { currentMobileDevice && currentTimelineItem !== null ?
                    <TrackMapPopup
                        mobileDevice={ currentMobileDevice }
                        timelineItem={ currentTimelineItem }
                        initialDate={ trackMapCurrentDate }
                        onClose={ () => {
                            setCurrentTimelineItem(null);
                        } }/>
                    : null
                }
            </>
        );
    }

    return (
        <>
            <PageHeader caption={ 'Путевой отчет' }>
                <TimelineIcon size={ 30 }/>
            </PageHeader>
            <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
        </>
    );
}

export default TrackSheet;
