import React, { useCallback, useEffect, useRef, useState } from 'react';
import DataGrid, { Column, LoadPanel, MasterDetail, Scrolling, Summary, TotalItem } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { useAppData } from '../../../contexts/app-data';
import { useAppSettings } from '../../../contexts/app-settings';
import TimelineInfo from './timeline-info/timeline-info';
import AppConstants from '../../../constants/app-constants';
import DataGridIconCellValueContainer from '../../../components/data-grid-utils/data-grid-icon-cell-value-container';
import { BeginDateIcon, DistanceIcon, GridAdditionalMenuIcon } from '../../../constants/app-icons';
import { Template } from 'devextreme-react/core/template';
import { DataGridToolbarButton, onDataGridToolbarPreparing } from '../../../components/data-grid-utils/data-grid-toolbar-button';
import { timelineExcelExporter } from './timeline-excel-exporter';
import  TimelineMainContextMenu from  './timeline-main-context-menu/timeline-main-context-menu';

import './timeline.scss';

const Timelines = ({ mobileDevice }) => {

    const { appSettingsData: { workDate } } = useAppSettings();
    const { getTimelinesAsync } = useAppData();
    const [currentTimeline, setCurrentTimeline] = useState(null);
    const dxDataGridRef = useRef(null);
    const mainContextMenuRef = useRef(null);

    useEffect(() => {
        ( async () => {
                let timeline = await getTimelinesAsync(mobileDevice.id, workDate) ?? [];
                timeline = timeline.map(t => {
                    return { ...t, active: true }
                });
                setCurrentTimeline(timeline);
            }
        )();
    }, [getTimelinesAsync, mobileDevice.id, workDate]);

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

    if (!( currentTimeline === null || currentTimeline.length === 0 )) {
        return (
            <>
                <DataGrid
                    ref={ dxDataGridRef }
                    className={ 'app-grid compact app-grid-detail timeline dx-card wide-card' }
                    width={ '100%' }
                    keyExpr={ 'id' }
                    focusedRowEnabled={ true }
                    dataSource={ currentTimeline }
                    showColumnLines={ true }
                    showRowLines={ true }
                    showBorders={ true }
                    onToolbarPreparing={ onDataGridToolbarPreparing }
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
                    <LoadPanel enabled={ false }/>
                    <Template name={ 'DataGridToolbarButtonTemplate' } render={ DataGridToolbarButton.bind(this, { contextMenuRef: mainContextMenuRef }) }/>
                    <Scrolling showScrollbar={ 'never' }/>

                    <Column type={ 'buttons' } width={ 60 }
                            cellRender={ (e) => {
                                return (
                                    <>
                                        <Button className={ 'app-command-button app-command-button-small' } onClick={ () => {
                                            toggleRowDetailByRowKey({ dataGrid: e.component, rowKey: e.row.key, mode: 'info' });
                                        } }>
                                            <GridAdditionalMenuIcon/>
                                        </Button>
                                    </>
                                )
                            } }/>

                    <Column dataField={ 'id' } dataType={ 'number' } caption={ 'Час' } width={ 60 } alignment={ 'center' }/>

                    <Column dataField={ 'beginDate' } dataType={ 'datetime' } hidingPriority={ 1 } caption={ 'Период времени' } width={ 200 }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => `${ new Date(e.data.beginDate).toLocaleDateString('ru-RU', {
                                        hour: 'numeric', minute: 'numeric'
                                    }) }
                                    - ${ new Date(e.data.endDate).toLocaleTimeString('ru-RU', {
                                        hour: 'numeric', minute: 'numeric'
                                    }) }` }
                                    iconRenderer={ (iconProps) => <BeginDateIcon { ...iconProps } /> }
                                />
                            }
                    />

                    <Column dataField={ 'distance' } dataType={ 'number' } caption={ 'Расстояние, км' } width={ 150 } alignment={ 'left' }
                            cellRender={ (e) =>
                                <DataGridIconCellValueContainer
                                    cellDataFormatter={ () => `${ ( e.data.distance / 1000 ).toFixed(2) } км` }
                                    iconRenderer={ (iconProps) => <DistanceIcon { ...iconProps } /> }
                                /> }
                    />
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
                                options.totalValue = ( options.totalValue / 1000 ).toFixed(2)
                            }
                        }
                    } }>
                        <TotalItem
                            name={ 'totalDistance' }
                            column={ 'distance' }
                            summaryType={ 'custom' }
                            displayFormat={ '{0} км' }
                            alignment={ 'left' }
                        />
                    </Summary>
                    <MasterDetail
                        enabled={ false }
                        render={ (e) => {
                            let detailComponent;
                            if (e.component.timelineDetailMode === 'info') {
                                detailComponent = <TimelineInfo timeline={ e.data } mobileDevice={ mobileDevice }/>;
                            } else {
                                detailComponent = null
                            }
                            return detailComponent;
                        } }
                    />
                </DataGrid>
                <TimelineMainContextMenu
                    ref={ mainContextMenuRef }
                    commands={
                        {
                            exportToXlsx: () => {
                                timelineExcelExporter({
                                    dxDataGrid: dxDataGridRef.current.instance,
                                    mobileDevice,
                                    workDate,
                                    title: 'Хронология',
                                });
                            }
                        }
                    }/>
            </>
        );
    }

    return <div className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</div>
};

export default Timelines;



