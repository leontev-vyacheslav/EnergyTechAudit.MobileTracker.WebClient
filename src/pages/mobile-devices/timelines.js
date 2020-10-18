import React, { useEffect, useState } from 'react';
import DataGrid, {
    Column,
    MasterDetail,
    Scrolling,
    Selection,
    Summary,
    TotalItem
} from 'devextreme-react/ui/data-grid';
import { getTimelinesAsync } from '../../api/mobile-devices';
import { useAppSettings } from '../../contexts/app-settings';
import appConstants from '../../constants/app-constants'
import TimelineInfo from './timeline-info';
import { MdTimeline } from 'react-icons/md';
import './timeline.scss';

const Timelines = ({ currentMobileDevice }) => {
    const { appSettingsData } = useAppSettings();
    const [currentTimeline, setCurrentTimeline] = useState(null);

    useEffect(() => {
        ( async () => {
            let timeline = await getTimelinesAsync(currentMobileDevice.id, appSettingsData.workDate);
            timeline = timeline.map(t => {
                return { ...t, ...{ active: true } };
            });
            setCurrentTimeline(timeline);
        } )();
    }, [appSettingsData.workDate, currentMobileDevice.id]);

    return ( ( currentTimeline !== null && currentTimeline.length > 0 ) ?
        ( <React.Fragment>
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
                    <Selection mode={'multiple'}/>
                    <Scrolling showScrollbar={ 'always' }/>
                    <Column type={ 'buttons' } width={ 50 }
                            cellRender={ () => {
                        return (
                            <>
                                <MdTimeline size={ 24 } color={ '#464646' } />
                            </>
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
                        enabled={ true }
                        render={ (e) => {
                            return <TimelineInfo timeline={ e.data } currentMobileDevice={ currentMobileDevice }/>;
                        } }
                    />
                </DataGrid>
            </React.Fragment>
        ) : <span className={ 'dx-datagrid-nodata' }>Нет данных для отображения</span> );
};

export default Timelines;



