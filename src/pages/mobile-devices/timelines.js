import React, { useMemo } from 'react';
import DataGrid, {
    Button,
    Column,
    MasterDetail,
    Scrolling,
    Selection,
    Summary,
    TotalItem
} from 'devextreme-react/ui/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import { getTimelines } from '../../api/mobile-devices';
import { useAppSettings } from '../../contexts/app-settings';
import appConstants from '../../constants/app-constants'

import './timeline.scss';
import TimelineInfo from './timeline-info';

let currentTimeline = null;

const Timelines = ({ currentMobileDevice }) => {
    const { appSettingsData } = useAppSettings();

    let dataSource = useMemo(() => {
        return new CustomStore({
            key: 'id',
            onLoaded: (result) => {
                currentTimeline = result;
            },
            load: () => {
                return getTimelines(currentMobileDevice.id, appSettingsData.workDate);
            }
        });
    }, [currentMobileDevice.id, appSettingsData.workDate]);

    return (
        <React.Fragment>
            <DataGrid
                className={ 'timeline dx-card wide-card' }
                width={ '100%' }
                dataSource={ dataSource }
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
            >
                <Scrolling showScrollbar={ 'always' }/>
                <Selection mode={ 'multiple' }/>
                <Column type={ 'buttons' } width={ 50 }>
                    <Button hint={ 'Показать на карте' } icon={ 'map' } onClick={ (e) => {
                        e.event.preventDefault();
                    } }/>
                </Column>
                <Column dataField={ 'id' } dataType={ 'number' } caption={ 'Ид' } width={ 50 }/>

                <Column dataField={ 'beginDate' } dataType={ 'datetime' } hidingPriority={ 1 }
                        caption={ 'Начало периода' }
                        width={ 150 }/>
                <Column dataField={ 'endDate' } dataType={ 'datetime' } hidingPriority={ 0 } caption={ 'Конец периода' }
                        width={ 150 }/>
                <Column dataField={ 'distance' } dataType={ 'number' } caption={ 'Расстояние' } width={ 150 }
                        alignment={ 'left' }/>

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
                    render={ (e) =>  {
                        const masterData = e.data;
                        let id = 0;
                        const timeline = [
                            {id: ++id, name: 'Расчет по краевым точкам:', value: masterData.takeAccountOutsidePoints === true ? 'Да' : 'Heт'},
                            {id: ++id, name: 'Был разрыв:', value: masterData.hasGap === true ? 'Да' : 'Нет'},

                            {id: ++id,  name: 'Средняя точность:', value: `${masterData.averageAccuracy} м`},
                            {id: ++id, name: 'Наилучшая точность:', value: `${masterData.bestAccuracy} м`},
                            {id: ++id, name: 'Наихудшая точность:', value: `${masterData.worstAccuracy} м`},

                            {id: ++id, name: 'Наибольший интервал:', value: `${masterData.largestInterval} м`},
                            {id: ++id, name: 'Наименьший интервал:', value: `${masterData.smallestInterval} м`},

                            {id: ++id, name: 'Значимых отсчетов:', value: masterData.valuableAmountLocations},
                            {id: ++id, name: 'Все отсчетов:', value: masterData.totalAmountLocations},
                        ];
                        /*const renderMostValuableAddress = async (locationExtended) => {
                            const geocodeResponse =  await geocodeAsync (
                                {
                                    lat: locationExtended.coords.latitude,
                                    lng: locationExtended.coords.longitude
                                }
                            );
                            if(geocodeResponse && geocodeResponse.status === 'OK')
                            {
                                const mostValuableAddress = geocodeResponse.results.find((e, i) => i === 0);
                                if(mostValuableAddress) {
                                    const div = document.createElement ('div');
                                    div.style.marginBottom = '10px';
                                    div.style.display = 'block';
                                    div.style.width = '250px';
                                    div.innerText = mostValuableAddress.formatted_address;
                                    container.append (div);
                                }
                            }
                        };
                        await renderMostValuableAddress(currentMasterData.firstLocationExtended);
                        await renderMostValuableAddress(currentMasterData.lastLocationExtended) ;*/

                        return <TimelineInfo timeline={ timeline }/>;
                    } }
                />
            </DataGrid>
        </React.Fragment>
    );
};

export default Timelines;



