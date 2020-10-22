import React, { useEffect, useState } from 'react';
import DataGrid, { Column } from 'devextreme-react/ui/data-grid';
import './timeline-info.scss';
import appConstants from '../../../../constants/app-constants';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import Geocode from '../../../../api/external/geocode';

import { MdAdjust, MdCompareArrows, MdGpsFixed, MdMoreHoriz, MdSettingsEthernet } from 'react-icons/md';
import { TimelineInfoHeader } from './timeline-info-header';

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
            const fetchAddressAsync = async (location) => {
                const geocodeResponse = await Geocode.fromLatLng(location.latitude, location.longitude);
                if (geocodeResponse && geocodeResponse.status === 'OK') {
                    return geocodeResponse.results.find((e, i) => i === 0).formatted_address;
                }
                return null;
            };
            setDeparture(await fetchAddressAsync(timeline.firstLocationRecord));
            setDestination(await fetchAddressAsync(timeline.lastLocationRecord));
        } )();
    }, [timeline.firstLocationRecord, timeline.lastLocationRecord]);

    return ( ( departure !== null && destination !== null ) ?
        (
            <React.Fragment>
                <TimelineInfoHeader currentMobileDevice={ currentMobileDevice } departure={ departure } destination={ destination }/>
                <DataGrid
                    className={ 'timeline-info' }
                    width={ '100%' }
                    noDataText={ appConstants.noDataLongText }
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
                    <Column dataField={ 'name' } caption={ 'Параметр' } width={ 200 } cellRender={ (e) => {
                        if (e.data) {
                            const Icon = (props) => React.createElement(IconComponents[`${ e.data.icon }`], props);
                            return (
                                <div style={ { display: 'flex' } }>
                                    { ( e.data.icon ? <Icon size={ 18 } style={ { marginRight: 10 } }/> : null ) }
                                    <div>{ e.data.name }</div>
                                </div>
                            );
                        }
                    } }/>
                    <Column dataField={ 'value' } caption={ 'Значение' } width={ 150 } alignment={ 'left' }/>
                </DataGrid>
            </React.Fragment> )
        : null );
};

export default TimelineInfo;
