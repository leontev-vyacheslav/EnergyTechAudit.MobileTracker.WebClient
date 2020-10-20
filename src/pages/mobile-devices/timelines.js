import React, { useCallback, useEffect, useState } from 'react';
import DataGrid, {
    Column,
    MasterDetail,
    Scrolling,
    Selection,
    Summary,
    TotalItem
} from 'devextreme-react/ui/data-grid';
import { Popup } from 'devextreme-react/ui/popup'
import { getTimelinesAsync } from '../../api/mobile-devices';
import { useAppSettings } from '../../contexts/app-settings';
import appConstants from '../../constants/app-constants'
import TimelineInfo from './timeline-info';
import { MdTimeline, MdMap } from 'react-icons/md';
import './timeline.scss';
import TrackMap from './track-map';

const Timelines = ({ currentMobileDevice }) => {
    const { appSettingsData } = useAppSettings();
    const [currentTimeline, setCurrentTimeline] = useState(null);
    const [currentTimelineItem, setCurrentTimelineItem] = useState(null);

    useEffect(() => {
        ( async () => {
            let timeline = await getTimelinesAsync(currentMobileDevice.id, appSettingsData.workDate);
            timeline = timeline.map(t => {
                return { ...t, ...{ active: true } };
            });
            setCurrentTimeline(timeline);
        } )();
    }, [appSettingsData.workDate, currentMobileDevice.id]);

    const toggleRowDetailByRowKey = useCallback(({ dataGrid, rowKey, mode }) => {
        if (dataGrid.isRowExpanded(rowKey) && dataGrid.timelineDetailMode !== mode) {
            dataGrid.collapseRow(rowKey);
            dataGrid.expandRow(rowKey);
            dataGrid.timelineDetailMode = mode;
        } else {
            if (dataGrid.isRowExpanded(rowKey)) {
                dataGrid.collapseRow(rowKey);
                dataGrid.timelineDetailMode = null;
            } else {
                dataGrid.expandRow(rowKey);
                dataGrid.timelineDetailMode = mode;
            }
        }
    }, []);

    return ( ( currentTimeline !== null && currentTimeline.length > 0 ) ?
            ( <React.Fragment>
                    { currentTimelineItem !== null ?
                        <Popup className={'track-map-popup'} title={ 'Карта маршрута' } c dragEnabled={ false } visible={ true } showTitle={ true }
                               width={ 1024 }
                               height={ 600 }
                               contentRender={ () => {
                                   return <TrackMap currentMobileDevice={ currentMobileDevice } timelineItem={ currentTimelineItem }/>
                               } }
                               onHiding={ () => {
                                   setCurrentTimelineItem(null);
                               } }
                        >
                        </Popup>
                        : null }
                    <DataGrid
                        className={ 'timeline dx-card wide-card' }
                        width={ '100%' }
                        keyExpr={ 'id' }
                        dataSource={ currentTimeline }
                        showColumnLines={ true }
                        showRowLines={ true }
                        showBorders={ true }
                        noDataText={ appConstants.noDataLongText }
                        onSelectionChanged={ (e) => {
                            e.component.refresh(true);
                        } }
                        onRowExpanding={ (e) => {
                            e.component.collapseAll(-1);
                        } }
                        onRowExpanded={ () => {
                            const masterDetailRow = document.querySelector('.timeline .dx-master-detail-row')
                            if (masterDetailRow) {
                                const previousMasterDetailRow = masterDetailRow.previousElementSibling;
                                if (previousMasterDetailRow) {
                                    previousMasterDetailRow.style.fontWeight = 'bold';
                                    previousMasterDetailRow.classList.add('dx-row-focused');
                                }
                            }
                        } }
                        onInitialized={ (e) => {
                            e.component.selectAll();
                        } }
                    >
                        <Selection mode={ 'multiple' } showCheckBoxesMode={ 'always' }/>
                        <Scrolling showScrollbar={ 'always' }/>
                        <Column type={ 'buttons' } width={ 85 }

                                cellRender={ (e) => {
                                    return (
                                        <React.Fragment>
                                            <MdTimeline style={ { cursor: 'pointer' } } size={ 24 } color={ '#464646' } onClick={ () => {
                                                toggleRowDetailByRowKey({ dataGrid: e.component, rowKey: e.row.key, mode: 'info' });
                                            } }/>
                                            <MdMap style={ { cursor: 'pointer', marginLeft: 10 } } size={ 24 } color={ '#464646' } onClick={ () => {
                                                e.component.collapseRow(e.row.key);
                                                setCurrentTimelineItem(e.data);
                                            } }/>
                                        </React.Fragment>
                                    )
                                } }/>
                        <Column dataField={ 'id' } dataType={ 'number' } caption={ 'Ид' } width={ 50 }/>
                        <Column dataField={ 'beginDate' } dataType={ 'datetime' } hidingPriority={ 1 } caption={ 'Начало периода' } width={ 150 }/>
                        <Column dataField={ 'endDate' } dataType={ 'datetime' } hidingPriority={ 0 } caption={ 'Конец периода' } width={ 150 }/>
                        <Column dataField={ 'distance' } dataType={ 'number' } caption={ 'Расстояние' } width={ 150 } alignment={ 'left' }/>
                        <Summary calculateCustomSummary={ (options) => {
                            if (!currentTimeline) return;
                            if (options.name === 'totalDistance') {
                                if (options.summaryProcess === 'start') {
                                    options.totalValue = 0;
                                } else if (options.summaryProcess === 'calculate') {
                                    options.totalValue = 0;
                                    const keys = options.component.getSelectedRowKeys();
                                    keys.forEach(k => {
                                        const element = currentTimeline.find(e => e.id === k);
                                        if (element) {
                                            options.totalValue = options.totalValue + element.distance;
                                        }
                                    });
                                } else if (options.summaryProcess === 'finalize') {
                                    options.totalValue = Math.round(options.totalValue * 100) / 100
                                }
                            }
                        } }>
                            <TotalItem
                                name={ 'totalDistance' }
                                column={ 'distance' }
                                summaryType={ 'custom' }
                                displayFormat={ '{0} м' }
                                alignment={ 'left' }
                            />
                        </Summary>
                        <MasterDetail
                            enabled={ false }
                            render={ (e) => {
                                let detailComponent;
                                if (e.component.timelineDetailMode === 'info') {
                                    detailComponent = <TimelineInfo timeline={ e.data } currentMobileDevice={ currentMobileDevice }/>;
                                } else {
                                    detailComponent = null
                                }
                                return detailComponent;
                            } }
                        />
                    </DataGrid>
                </React.Fragment>
            ) :
            <span className={ 'dx-datagrid-nodata' }>Нет данных для отображения</span>
    )
};

export default Timelines;



