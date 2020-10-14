import React, { useEffect,  useState } from 'react';
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
            const timeline = await getTimelinesAsync(currentMobileDevice.id, appSettingsData.workDate);
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
                    onInitialized={ (e) =>
                    {
                        e.component.selectAll();
                    }}
                >
                    <Scrolling showScrollbar={ 'always' }/>
                    <Selection mode={ 'multiple' }/>
                    <Column type={ 'buttons' } width={ 50 } cellRender={ () => {
                        return <MdTimeline size={ 24 } color={ '#464646' }/>
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
                            const masterData = e.data;
                            let id = 0;
                            const timelineInfo = [
                                {
                                    id: ++id,
                                    name: 'Расчет по краевым точкам:',
                                    value: masterData.takeAccountOutsidePoints === true ? 'Да' : 'Heт'
                                },
                                { id: ++id, name: 'Был разрыв:', value: masterData.hasGap === true ? 'Да' : 'Нет' },

                                { id: ++id, name: 'Средняя точность:', value: `${ masterData.averageAccuracy } м` },
                                { id: ++id, name: 'Наилучшая точность:', value: `${ masterData.bestAccuracy } м` },
                                { id: ++id, name: 'Наихудшая точность:', value: `${ masterData.worstAccuracy } м` },

                                { id: ++id, name: 'Наибольший интервал:', value: `${ masterData.largestInterval } м` },
                                { id: ++id, name: 'Наименьший интервал:', value: `${ masterData.smallestInterval } м` },

                                { id: ++id, name: 'Значимых отсчетов:', value: masterData.valuableAmountLocations },
                                { id: ++id, name: 'Все отсчетов:', value: masterData.totalAmountLocations },
                            ];

                            return <TimelineInfo timelineInfo={ timelineInfo } timeline={ masterData }/>;
                        } }
                    />
                </DataGrid>
            </React.Fragment>
        ) : <span className={ 'dx-datagrid-nodata' }>Нет данных для отображения</span> );
};

export default Timelines;



