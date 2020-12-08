import React, { useCallback, useEffect, useState } from 'react';
import DataGrid, { Column, MasterDetail, Scrolling, Selection, Summary, TotalItem } from 'devextreme-react/ui/data-grid';
import { Button } from 'devextreme-react/ui/button';
import { MdTimeline, MdMap } from 'react-icons/md';
import { useAppSettings } from '../../../contexts/app-settings';
import { useAppData } from '../../../contexts/app-data';
import TimelineInfo from './timeline-info/timeline-info';
import TrackMapPopup from './track-map-popup/track-map-popup';
import AppConstants from '../../../constants/app-constants';
import Moment from 'moment';

import './timeline.scss';
import { HttpConstants } from '../../../constants/http-constants';

const Timelines = ({ currentMobileDevice }) => {
    const { appSettingsData } = useAppSettings();
    const { getTimelinesAsync } = useAppData();
    const [currentTimeline, setCurrentTimeline] = useState(null);
    const [currentTimelineItem, setCurrentTimelineItem] = useState(null);
    let content;

    useEffect(() => {
        ( async () => {
            let timeline = [];
            const response = await getTimelinesAsync(currentMobileDevice.id, appSettingsData.workDate);
            if (response && response.status === HttpConstants.StatusCodes.Ok ) {
                console.log(response.data);
                timeline = response.data;
                timeline = timeline.map(t => {
                    const utcOffset = -Moment().utcOffset();
                    return {
                        ...t, ...{
                            beginDate: Moment(t.beginDate).add(utcOffset, 'm'),
                            endDate: Moment(t.endDate).add(utcOffset, 'm'),
                            active: true
                        }
                    };
                });
            }
            setCurrentTimeline(timeline);
        } )();
    }, [getTimelinesAsync, appSettingsData.workDate, currentMobileDevice.id]);

    const toggleRowDetailByRowKey = useCallback(({ dataGrid, rowKey, mode }) => {
        if (dataGrid.isRowExpanded(rowKey) && dataGrid.timelineDetailMode !== mode) {
            dataGrid.timelineDetailMode = mode;
            dataGrid.collapseRow(rowKey);
            dataGrid.expandRow(rowKey);
        } else {
            if (dataGrid.isRowExpanded(rowKey)) {
                dataGrid.timelineDetailMode = null;
                dataGrid.collapseRow(rowKey);
            } else {
                dataGrid.timelineDetailMode = mode;
                dataGrid.expandRow(rowKey);
            }
        }
    }, []);

    if (currentTimeline === null || currentTimeline.length === 0) {
        content = <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
    } else {
        content = (
            <>
                <DataGrid
                    className={ 'timeline dx-card wide-card' }
                    width={ '100%' }
                    keyExpr={ 'id' }
                    focusedRowEnabled={ true }
                    dataSource={ currentTimeline }
                    showColumnLines={ true }
                    showRowLines={ true }
                    showBorders={ true }
                    noDataText={ AppConstants.noDataLongText }
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
                    <Scrolling showScrollbar={ 'never' }/>
                    <Column type={ 'buttons' } width={ 85 }

                            cellRender={ (e) => {
                                const buttonIconProps = { style: { cursor: 'pointer' }, size: 16, color: '#464646' };
                                return (
                                    <React.Fragment>
                                        <Button className={ 'time-line-command-button' } onClick={ () => {
                                            toggleRowDetailByRowKey({ dataGrid: e.component, rowKey: e.row.key, mode: 'info' });
                                        } }>
                                            <MdTimeline { ...buttonIconProps }/>
                                        </Button>
                                        <Button className={ 'time-line-command-button' } style={ { marginLeft: 3 } } onClick={ () => {
                                            e.component.timelineDetailMode = null;
                                            e.component.collapseAll(-1);
                                            setCurrentTimelineItem(e.data);
                                        } }>
                                            <MdMap { ...buttonIconProps } />
                                        </Button>
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
                { currentTimeline && currentTimelineItem !== null ?
                    <TrackMapPopup
                        mobileDevice={ currentMobileDevice }
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

export default Timelines;



