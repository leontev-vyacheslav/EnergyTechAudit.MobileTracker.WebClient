import React, { useEffect, useState } from 'react';
import DataGrid, { Column, LoadPanel, Scrolling } from 'devextreme-react/data-grid';
import { TimelineInfoHeader } from './timeline-info-header';
import AppConstants from '../../../../constants/app-constants';
import { useScreenSize } from '../../../../utils/media-query';
import { AppDataContextModel, useAppData } from '../../../../contexts/app-data';
import { AccuracyIcon, BreakIcon, CountdownIcon, EdgePointsIcon, IntervalIcon } from '../../../../constants/app-icons';

import './timeline-info.scss';
import { IconBaseProps } from 'react-icons/lib/cjs/iconBase';
import { TimelineInfoModel } from '../../../../models/timeline-info';
import { TimelineInfoProps, TimelineInfoRowProps } from '../../../../models/timeline-info-props';

const TimelineInfo = ({ timeline, mobileDevice }: TimelineInfoProps) => {

    const { isXSmall, isSmall } = useScreenSize();
    const { getGeocodedAddressAsync }: AppDataContextModel = useAppData();

    const [departure, setDeparture] = useState<string | null>(null);
    const [destination, setDestination] = useState<string | null>(null);
    const [timelineInfo, setTimelineInfo] = useState<TimelineInfoModel[] | null>(null);

    const TimelineInfoRow = ({ item } : TimelineInfoRowProps) => {
        return (
            <div style={ { display: 'flex', flexDirection: isXSmall || isSmall ? 'column' : 'row' } }>
                <div style={ { display: 'flex', width: 200, padding: isXSmall || isSmall ? 10 : 'initial' } }>
                    { ( item.iconRender ? item.iconRender({ size: 18, style: { marginRight: 10 } }) : null ) }
                    <div>{ item.description }</div>
                </div>
                <div style={ { padding: isXSmall || isSmall ? 10 : 'initial' } }>{ item.value }</div>
            </div> );
    };

    useEffect(() => {
        ( async () => {
            if(timeline) {
                const timeLineLocal = { ...timeline };

                const timelineInfo: TimelineInfoModel[] = [
                    {
                        id: 1,
                        description: 'По краевым точкам:',
                        iconRender: (props: IconBaseProps) => <EdgePointsIcon { ...props }/>,
                        value: timeLineLocal.takeAccountOutsidePoints === true ? 'Да' : 'Heт'
                    },
                    {
                        id: 2,
                        description: 'Разрыв:',
                        iconRender: (props: IconBaseProps) => <BreakIcon { ...props }/>,
                        value: timeLineLocal.hasGap === true ? 'Да' : 'Нет'
                    },
                    {
                        id: 3,
                        description: 'Точность:',
                        iconRender: (props: IconBaseProps) => <AccuracyIcon { ...props }/>,
                        value: `${ timeLineLocal.bestAccuracy } м / ${ timeLineLocal.worstAccuracy } м (${ timeline.averageAccuracy } м)`
                    },
                    {
                        id: 4,
                        description: 'Интервал:',
                        iconRender: (props: IconBaseProps) => <IntervalIcon  { ...props }/>,
                        value: `${ timeLineLocal.smallestInterval } м / ${ timeLineLocal.largestInterval } м`
                    },
                    {
                        id: 5,
                        description: 'Отсчетов:',
                        iconRender: (props: IconBaseProps) => <CountdownIcon { ...props }/>,
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
                <TimelineInfoHeader mobileDevice={ mobileDevice } departure={ departure } destination={ destination }/>
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
                    <LoadPanel enabled={ false }/>
                    <Scrolling showScrollbar={ 'never' }/>
                    <Column dataField={ 'description' } caption={ 'Параметр' } cellRender={ (e) => {
                        if (e.data) {
                            return <TimelineInfoRow item={ e.data }/>
                        }
                    } }/>
                </DataGrid>
            </div> )
        : <span style={ { position: 'relative', lineHeight: 30, height: 30 } } className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span> );
};

export default TimelineInfo;
