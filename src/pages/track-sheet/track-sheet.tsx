import React, { useCallback, useEffect, useRef, useState } from 'react';
import DataGrid, { Column, Grouping, LoadPanel, MasterDetail, Pager, Paging, Scrolling, SearchPanel } from 'devextreme-react/data-grid';
import { Template } from 'devextreme-react/core/template';
import { Button } from 'devextreme-react/button';
import { AppDataContextModel, useAppData } from '../../contexts/app-data';
import AppConstants from '../../constants/app-constants'
import SideNavigationMenu from '../../components/side-navigation-menu/side-navigation-menu';
import { useLocation } from 'react-router';
import TrackSheetContextMenu from './track-sheet-context-menu'
import { useScreenSize } from '../../utils/media-query';
import TrackMapPopup from '../../components/popups/track-map-popup/track-map-popup';
import { useAppSettings } from '../../contexts/app-settings';
import DataGridIconCellValueContainer from '../../components/data-grid-utils/data-grid-icon-cell-value-container';
import { AccuracyIcon, CurrentDateIcon, DistanceIcon, GridAdditionalMenuIcon, TimelineIcon } from '../../constants/app-icons';
import PageHeader from '../../components/page-header/page-header';
import TrackSheetMainContextMenu from './track-sheet-main-context-menu/track-sheet-main-context-menu'
import { trackSheetExcelExporter } from './track-sheet-excel-exporter';
import { DataGridToolbarButton, onDataGridToolbarPreparing } from '../../components/data-grid-utils/data-grid-toolbar-button';
import { getUserDeviceDescription } from '../../utils/string-helper';
import MobileDevicesMasterDetailView from '../mobile-devices/mobile-devices-master-detail-view/mobile-devices-master-detail-view';
import './track-sheet.scss';
import { AppSettingsContextModel } from '../../models/app-settings-context';
import ContextMenu from 'devextreme-react/context-menu';
import { useSharedArea } from '../../contexts/shared-area';
import { MobileDeviceModel } from '../../models/mobile-device';

const TrackSheet = () => {
    function useQuery () {
        return new URLSearchParams(useLocation().search);
    }

    const query = useQuery();
    const { isXSmall } = useScreenSize();
    const { appSettingsData: { workDate }, getDailyTimelineItem }: AppSettingsContextModel = useAppSettings();
    const { getMobileDeviceAsync, getTrackSheetAsync }: AppDataContextModel = useAppData();

    const [trackSheet, setTrackSheet] = useState<any>(null);
    const [mobileDevice, setMobileDevice] = useState<MobileDeviceModel | null>(null);
    const [currentTimelineItem, setCurrentTimelineItem] = useState<any>(null);
    const [trackMapCurrentDate, setTrackMapCurrentDate] = useState<any>(null);
    const [mobileDeviceId] = useState<number>(parseInt(query.get('mobileDeviceId') ?? '0'));
    const [currentDate] = useState(query.get('currentDate'));

    const dxDataGridRef = useRef<DataGrid<any, number>>(null);
    const mainContextMenuRef = useRef<ContextMenu<any>>();
    const rowContextMenuRef = useRef<ContextMenu<any>>();

    const { treeViewRef } = useSharedArea();

    const refreshAsync = useCallback(async () => {
        if (currentDate) {
            const mobileDevice = await getMobileDeviceAsync(mobileDeviceId);
            setMobileDevice(mobileDevice);
            if(mobileDevice) {
              const trackSheet = await getTrackSheetAsync(mobileDeviceId, currentDate);
              if (trackSheet && trackSheet.dailyCoveredDistances) {
                trackSheet.dailyCoveredDistances = trackSheet.dailyCoveredDistances.map((ts: any) => {
                  return { ...ts, ...{ userId: mobileDevice.userId, mobileDeviceId: mobileDevice.id } }
                });
                setTrackSheet(trackSheet);
              }
            }
        }
    }, [currentDate, mobileDeviceId, getMobileDeviceAsync, getTrackSheetAsync]);

    useEffect(() => {
        ( async () => {
            await refreshAsync();
        } )();

      treeViewRef?.current?.instance.unselectAll();
    }, [refreshAsync]);

    const GroupRowContent = () => {
        const userCaption = getUserDeviceDescription(mobileDevice);
        return (
            <div className={ 'user-grid-group track-sheet-group ' }>
                <div className={ 'dx-icon dx-icon-user' }/>
                <div style={ { display: 'grid', gap: 5 } }>
                    <div className={ 'mobile-devices-group-line' }>
                        <div>
                            <span>{ !isXSmall ? 'Пользователь: ' : '' }</span>
                            <span>{ userCaption } </span>
                        </div>
                    </div>
                    <div className={ 'mobile-devices-group-line' }>
                        <span>{ !isXSmall ? 'Всего пройдено за период:' : null }
                            <span className={ 'badge' }>{ ( trackSheet.totalCoveredDistance / 1000 ).toFixed(2) } км</span>
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    if (currentDate && trackSheet !== null && trackSheet.length !== 0 && mobileDevice) {
        return (
            <>
                <PageHeader caption={ 'Путевой отчет' }>
                    <TimelineIcon size={ AppConstants.headerIconSize }/>
                </PageHeader>
                <DataGrid
                    ref={ dxDataGridRef }
                    keyExpr={ 'id' }
                    className={ 'app-grid mobile-devices track-sheet dx-card wide-card' }
                    noDataText={ AppConstants.noDataLongText }
                    dataSource={ trackSheet?.dailyCoveredDistances ?? [] }
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
                >
                    <LoadPanel enabled={ false }/>
                    <Template name={ 'DataGridToolbarButtonTemplate' } render={ DataGridToolbarButton.bind(this, { contextMenuRef: mainContextMenuRef }) }/>
                    <SearchPanel visible={ true } searchVisibleColumnsOnly={ false }/>

                    <Scrolling showScrollbar={ 'never' }/>
                    <Paging defaultPageSize={ isXSmall ? 5 : 10 }/>
                    <Pager showPageSizeSelector={ true } showInfo={ true }/>
                    <Grouping autoExpandAll={ true } key={ 'userId' }/>

                    <Column
                        dataField={ 'userId' }
                        groupIndex={ 0 }
                        groupCellRender={ () => <GroupRowContent/> }
                        visible={ false }
                    />

                    <Column type={ 'buttons' } width={ 50 } cellRender={ () => {
                        return (
                            <Button className={ 'app-command-button app-command-button-small' } onClick={ async e => {
                              if(rowContextMenuRef.current) {
                                rowContextMenuRef.current.instance.option('target', e.element);
                                await rowContextMenuRef.current.instance.show();
                              }
                            } }>
                                <GridAdditionalMenuIcon/>
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
                    <Column/>

                    <MasterDetail
                        enabled={ true }
                        render={ (e) => {
                            return <MobileDevicesMasterDetailView mobileDevice={ mobileDevice } workDate={ e.data.date }/>;
                        } }
                    />

                </DataGrid>

                <TrackSheetContextMenu ref={ rowContextMenuRef } commands={ { showTrackMap : () => {
                    if (dxDataGridRef.current && dxDataGridRef.current.instance) {
                      const currentRowKey = dxDataGridRef.current.instance.option('focusedRowKey');
                      const currentDailyCoveredDistanceItem = trackSheet.dailyCoveredDistances.find((ts: any) => ts.id === currentRowKey);
                      setTrackMapCurrentDate(currentDailyCoveredDistanceItem.date)
                      setCurrentTimelineItem(getDailyTimelineItem(currentDailyCoveredDistanceItem.date));
                    }
                  }
                } }/>
                <TrackSheetMainContextMenu
                    ref={ mainContextMenuRef }
                    commands={
                        {
                            refreshAsync: refreshAsync,
                            exportToXlsx: () => {
                              if (dxDataGridRef.current) {
                                trackSheetExcelExporter({
                                  dataGrid: dxDataGridRef.current.instance,
                                  mobileDevice,
                                  workDate,
                                  title: 'Путевой отчет'
                                });
                              }
                            }
                        }
                    }/>

                { mobileDevice && currentTimelineItem !== null ?
                    <TrackMapPopup
                        mobileDevice={ mobileDevice }
                        workDate={ trackMapCurrentDate }
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
                <TimelineIcon size={ AppConstants.headerIconSize }/>
            </PageHeader>
            <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
        </>
    );
}

export default TrackSheet;
