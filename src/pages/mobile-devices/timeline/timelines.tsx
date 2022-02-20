import React, { useCallback, useEffect, useRef, useState } from 'react';
import DataGrid, {
  Column,
  LoadPanel,
  MasterDetail,
  Pager,
  Paging,
  Scrolling,
  Summary,
  TotalItem
} from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { useAppData } from '../../../contexts/app-data';
import { useAppSettings } from '../../../contexts/app-settings';
import TimelineInfo from './timeline-info/timeline-info';
import AppConstants from '../../../constants/app-constants';
import DataGridIconCellValueContainer from '../../../components/data-grid-utils/data-grid-icon-cell-value-container';
import { BeginDateIcon, DistanceIcon, GridAdditionalMenuIcon } from '../../../constants/app-icons';
import { Template } from 'devextreme-react/core/template';
import {  DataGridToolbarButton,  onDataGridToolbarPreparing } from '../../../components/data-grid-utils/data-grid-toolbar-button';
import { timelineExcelExporter } from './timeline-excel-exporter';
import TimelineMainContextMenu from './timeline-main-context-menu/timeline-main-context-menu';
import './timeline.scss';
import { MobileDeviceWorkDateModel } from '../../../models/mobile-device-work-date-model';
import { TimelineModel } from '../../../models/timeline';
import ContextMenu from 'devextreme-react/context-menu';
import { ContextMenuItemItemModel } from '../../../models/context-menu-item-props';
import dxDataGrid from 'devextreme/ui/data_grid';
import { Entity } from '../../../models/entity';

const Timelines = ({ mobileDevice, workDate }: MobileDeviceWorkDateModel) => {

    const { appSettingsData: { workDate: appSettingsWorkDate } } = useAppSettings();
    const [currentWorkDate] = useState<Date>(workDate ?? appSettingsWorkDate);
    const { getTimelinesAsync } = useAppData();
    const [currentTimeline, setCurrentTimeline] = useState<TimelineModel[] | null>(null);
    const dxDataGridRef = useRef<DataGrid<TimelineModel, number>>(null);
    const mainContextMenuRef = useRef<ContextMenu<ContextMenuItemItemModel>>(null);

    useEffect(() => {
      (async () => {
          if (mobileDevice) {
            let timeline = await getTimelinesAsync(mobileDevice.id, currentWorkDate) ?? [];
            timeline = timeline.map(t => {
              return { ...t, active: true }
            });
            setCurrentTimeline(timeline);
          }
        }
      )();
    }, [currentWorkDate, getTimelinesAsync, mobileDevice]);

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
                    onSelectionChanged={ async e => {
                        await e.component.refresh(true);
                    } }
                    onRowExpanding={ (e) => {
                        e.component.collapseAll(-1);
                    } }
                    onRowExpanded={ () => {
                        const masterDetailRow = document.querySelector('.timeline .dx-master-detail-row')
                        if (masterDetailRow) {
                            const previousMasterDetailRow = masterDetailRow.previousElementSibling as  HTMLElement;
                            if (previousMasterDetailRow) {
                                previousMasterDetailRow.style.fontWeight = 'bold';
                                previousMasterDetailRow.classList.add('dx-row-focused');
                            }
                        }
                    } }
                    onInitialized={ async e => {
                        await e.component?.selectAll();
                    } }
                >
                    <Scrolling showScrollbar={ 'never' }/>
                    <LoadPanel enabled={ false }/>
                    <Template name={ 'DataGridToolbarButtonTemplate' } render={ DataGridToolbarButton.bind(this, { contextMenuRef: mainContextMenuRef }) }/>
                    <Pager allowedPageSizes={ [5, 10] } showPageSizeSelector={ true }  />
                    <Paging defaultPageSize={ 5 } />


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
                    <Summary calculateCustomSummary={ (options: any) => {
                        if (!currentTimeline) return;

                        if (options.name === 'totalDistance') {
                            if (options.summaryProcess === 'start') {
                                options.totalValue = 0;
                            } else if (options.summaryProcess === 'calculate') {
                                options.totalValue = 0;
                                const keys = options.component.getSelectedRowKeys();
                                keys.forEach((k: number) => {
                                    const element = currentTimeline.find((e: TimelineModel) => e.id === k);
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
                  commands={ {
                    exportToXlsx: () => {
                      if (dxDataGridRef.current) {
                        timelineExcelExporter({
                          dataGrid: dxDataGridRef.current.instance as unknown as dxDataGrid<Entity, number>,
                          mobileDevice,
                          workDate: currentWorkDate,
                          title: 'Хронология',
                        });
                      }
                    }
                  }
                  } />
            </>
        );
    }

    return <div className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</div>
};

export default Timelines;



