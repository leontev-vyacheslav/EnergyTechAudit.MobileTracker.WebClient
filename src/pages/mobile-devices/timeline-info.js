import React, { useEffect, useState } from 'react';
import DataGrid, { Column } from 'devextreme-react/ui/data-grid';
import './timeline-info.scss';
import appConstants from '../../constants/app-constants';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';
import Geocode from '../../api/geocode';

import { MdLocationOn } from 'react-icons/md';

const TimelineInfo = ({ timelineInfo, timeline }) => {

    const [departure, setDeparture] = useState(null);
    const [destination, setDestination] = useState(null);

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
                <div className={ 'timeline-info-points' }>
                    <div className={ 'departure' }>
                        <MdLocationOn size={18} />
                        <div>{ departure }</div>
                    </div>
                    <div className={ 'destination' }>
                        <MdLocationOn size={18} />
                        <div>{ destination }</div>
                    </div>
                </div>
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
                    <Column dataField={ 'name' } caption={ 'Параметр' } width={ 250 }/>
                    <Column dataField={ 'value' } caption={ 'Значение' } width={ 150 } alignment={ 'left' }/>
                </DataGrid>
            </React.Fragment> )
        : null );
};

export default TimelineInfo;
