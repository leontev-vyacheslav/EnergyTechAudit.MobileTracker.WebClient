import React from 'react';
import DataGrid, {Button, Column, Scrolling, Selection, Summary, TotalItem} from 'devextreme-react/ui/data-grid';

const TrackItems = () => {

    return (
        <React.Fragment>
            <DataGrid keyExpr={ 'id' } showColumnLines={ true } showRowLines={ true } showBorders={ true }>
                <Scrolling showScrollbar={ 'always' }/>
                <Selection mode={ 'multiple' }/>
                <Column type={ 'buttons' } width={ 50 }>
                    <Button hint={ 'Показать на карте' } icon={ 'map' } onClick={ async (e) => {
                        e.event.preventDefault();
                    } }/>
                </Column>
                <Column dataField={ 'id' } dataType={ 'number' } caption={ 'Интервал' } width={ 50 }/>
                <Column dataField={ 'beginDate' } dataType={ 'datetime' } caption={ 'Начало периода' } width={ 150 }/>
                <Column dataField={ 'endDate' } dataType={ 'datetime' } caption={ 'Конец периода' } width={ 150 }/>
                <Column dataField={ 'distance' } dataType={ 'number' } caption={ 'Расстояние' } width={ 150 }
                        alignment={ 'left' }/>
                <Summary calculateCustomSummary={ (options) => {
                    if (options.name === 'totalDistance') {
                        if (options.summaryProcess === 'start') {
                            options.totalValue = 0;
                        } else if (options.summaryProcess === 'calculate') {
                            options.totalValue = 0;
                            const keys = options.component.getSelectedRowKeys();
                            keys.forEach(k => {
                                const element = null /*currentTimeline.find(e => e.id === k)*/;
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
                        displayFormat={ 'Все пройдено: {0} м' }
                    />

                </Summary>
            </DataGrid>
        </React.Fragment>
    );
};

export default TrackItems;
