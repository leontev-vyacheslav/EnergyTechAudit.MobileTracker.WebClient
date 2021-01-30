import React, { useEffect, useState } from 'react';
import DataGrid, { Column, Scrolling } from 'devextreme-react/data-grid';
import { TimelineInfoHeader } from './timeline-info-header';
import AppConstants from '../../../../constants/app-constants';
import { useScreenSize } from '../../../../utils/media-query';
import { useAppData } from '../../../../contexts/app-data';
import { AccuracyIcon, BreakIcon, CountdownIcon, EdgePointsIcon, IntervalIcon } from '../../../../constants/app-icons';

import './timeline-info.scss';



const TimelineInfo = ({ timeline, currentMobileDevice }) => {

    const { isXSmall, isSmall } = useScreenSize();
    const { getGeocodedAddressAsync } = useAppData();

    const [departure, setDeparture] = useState(null);
    const [destination, setDestination] = useState(null);
    const [timelineInfo, setTimelineInfo] = useState(null);

    const TimelineInfoRow = ({ dataItem }) => {
        return (
            <div style={ { display: 'flex', flexDirection: isXSmall || isSmall ? 'column' : 'row' } }>
                <div style={ { display: 'flex', width: 200, padding: isXSmall || isSmall ? 10 : 'initial' } }>
                    { ( dataItem.iconRender ? dataItem.iconRender({ size: 18, style: { marginRight: 10 } }) : null ) }
                    <div>{ dataItem.description }</div>
                </div>
                <div style={ { padding: isXSmall || isSmall ? 10 : 'initial' } }>{ dataItem.value }</div>
            </div> );
    };

    useEffect(() => {
        ( async () => {
            if(timeline) {
                const timeLineLocal = { ...timeline };

                let timelineInfo = [
                    {
                        id: 1,
                        description: 'По краевым точкам:',
                        iconRender: (props) => <EdgePointsIcon { ...props }/>,
                        value: timeLineLocal.takeAccountOutsidePoints === true ? 'Да' : 'Heт'
                    },
                    {
                        id: 2,
                        description: 'Разрыв:',
                        iconRender: (props) => <BreakIcon { ...props }/>,
                        value: timeLineLocal.hasGap === true ? 'Да' : 'Нет'
                    },
                    {
                        id: 3,
                        description: 'Точность:',
                        iconRender: (props) => <AccuracyIcon { ...props }/>,
                        value: `${ timeLineLocal.bestAccuracy } м / ${ timeLineLocal.worstAccuracy } м (${ timeline.averageAccuracy } м)`
                    },
                    {
                        id: 4,
                        description: 'Интервал:',
                        iconRender: (props) => <IntervalIcon  { ...props }/>,
                        value: `${ timeLineLocal.smallestInterval } м / ${ timeLineLocal.largestInterval } м`
                    },
                    {
                        id: 5,
                        description: 'Отсчетов:',
                        iconRender: (props) => <CountdownIcon { ...props }/>,
                        value: `${ timeLineLocal.valuableAmountLocations } /  ${ timeLineLocal.totalAmountLocations }`
                    },
                ];

                setTimelineInfo(timelineInfo);
                setDeparture(await getGeocodedAddressAsync(timeline.firstLocationRecord));
                setDestination(await getGeocodedAddressAsync(timeline.lastLocationRecord));
            }
        } )();
    }, [getGeocodedAddressAsync, timeline]);

    return (timelineInfo ?
        (
            <div className={ 'timeline-info-container' }>
                <TimelineInfoHeader currentMobileDevice={ currentMobileDevice } departure={ departure } destination={ destination }/>
                <DataGrid
                    className={ 'app-grid timeline-info' }
                    width={ isXSmall || isSmall ? '100%' : '50%' }
                    height={ '100%' }
                    noDataText={ AppConstants.noDataLongText }
                    dataSource={ timelineInfo }
                    showBorders={ true }
                    showColumnLines={ true }
                    showRowLines={ true }
                >
                    <Scrolling showScrollbar={ 'never' }/>
                    <Column dataField={ 'description' } caption={ 'Параметр' } cellRender={ (e) => {
                        if (e.data) {
                            return <TimelineInfoRow dataItem={ e.data }/>
                        }
                    } }/>
                </DataGrid>
            </div> )
        : <span style={ { position: 'relative', lineHeight: 30, height: 30 } } className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span> );
};

export default TimelineInfo;
