import React, { useEffect, useState } from 'react';
import DataGrid, { Column } from 'devextreme-react/ui/data-grid';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import { MdAdjust, MdCompareArrows, MdGpsFixed, MdMoreHoriz, MdSettingsEthernet } from 'react-icons/md';
import { TimelineInfoHeader } from './timeline-info-header';
import AppConstants from '../../../../constants/app-constants';
import { Scrolling } from 'devextreme-react/data-grid';
import { useScreenSize } from '../../../../utils/media-query';
import { useAppData } from '../../../../contexts/app-data';

import './timeline-info.scss';

const IconComponents = {
    Marks: MdGpsFixed,
    Break: MdCompareArrows,
    Intervals: MdSettingsEthernet,
    OutsidePoints: MdMoreHoriz,
    Accuracy: MdAdjust
};

const TimelineInfo = ({ timeline, currentMobileDevice }) => {

    const [departure, setDeparture] = useState(null);
    const [destination, setDestination] = useState(null);
    const [timelineInfo, setTimelineInfo] = useState(null);

    const { isXSmall, isSmall } = useScreenSize();
    const { getGeocodedAddressAsync } = useAppData();

    useEffect(() => {
        const timeLineLocal = { ...timeline };
        let timelineInfo = [
            { name: 'По краевым точкам:', icon: 'OutsidePoints', value: timeLineLocal.takeAccountOutsidePoints === true ? 'Да' : 'Heт' },
            { name: 'Разрыв:', icon: 'Break', value: timeLineLocal.hasGap === true ? 'Да' : 'Нет' },
            {
                name: 'Точность:',
                icon: 'Accuracy',
                value: `${ timeLineLocal.bestAccuracy } м / ${ timeLineLocal.worstAccuracy } м (${ timeline.averageAccuracy } м)`
            },
            { name: 'Интервал:', icon: 'Intervals', value: `${ timeLineLocal.smallestInterval } м / ${ timeLineLocal.largestInterval } м` },
            { name: 'Отсчетов:', icon: 'Marks', value: `${ timeLineLocal.valuableAmountLocations } /  ${ timeLineLocal.totalAmountLocations }` },
        ].map((t, i) => {
            t['id'] = i;
            return t;
        });

        setTimelineInfo(timelineInfo);
    }, [timeline]);

    useEffect(() => {
        ( async () => {
            setDeparture(await getGeocodedAddressAsync(timeline.firstLocationRecord));
            setDestination(await getGeocodedAddressAsync(timeline.lastLocationRecord));
        } )();
    }, [getGeocodedAddressAsync, timeline.firstLocationRecord, timeline.lastLocationRecord]);

    return ( window !== 0 ?
        (
            <>
                <TimelineInfoHeader currentMobileDevice={ currentMobileDevice } departure={ departure } destination={ destination }/>
                <DataGrid
                    className={ 'timeline-info' }
                    width={ isXSmall || isSmall ? '100%' : '50%' }
                    noDataText={ AppConstants.noDataLongText }
                    dataSource={ new DataSource({
                        store: new ArrayStore({
                            key: 'id',
                            data: timelineInfo
                        })
                    }) }
                    showBorders={ true }
                    showColumnLines={ true }
                    showRowLines={ true }
                >
                    <Scrolling showScrollbar={ 'never' }/>
                    <Column dataField={ 'name' } caption={ 'Параметр' } cellRender={ (e) => {
                        if (e.data) {
                            const Icon = (props) => React.createElement(IconComponents[`${ e.data.icon }`], props);

                            return (
                                <div style={ { display: 'flex', flexDirection: isXSmall || isSmall ? 'column' : 'row' } }>
                                    <div style={ { display: 'flex', width: 200, padding: isXSmall || isSmall ? 10 : 'initial' } }>
                                        { ( e.data.icon ? <Icon size={ 18 } style={ { marginRight: 10 } }/> : null ) }
                                        <div>{ e.data.name }</div>
                                    </div>
                                    <div style={ { padding: isXSmall || isSmall ? 10 : 'initial' } }>{ e.data.value }</div>
                                </div>
                            )
                        }
                    } }/>
                </DataGrid>
            </> )
        : <span style={ { position: 'relative', lineHeight: 30, height: 30 } } className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span> );
};

export default TimelineInfo;
