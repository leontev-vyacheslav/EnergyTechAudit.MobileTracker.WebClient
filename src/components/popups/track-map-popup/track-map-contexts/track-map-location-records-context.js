import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAppData } from '../../../../contexts/app-data';
import { useTrackMapTimelineContext } from './track-map-timeline-context';

const TrackMapLocationRecordsContext = createContext({});

const useTrackMapLocationRecordsContext = () => useContext(TrackMapLocationRecordsContext);

function TrackMapLocationRecordsProvider (props) {

    const { mobileDevice } = props;
    const { currentTimelineItem } = useTrackMapTimelineContext();
    const { getLocationRecordsByRangeAsync } = useAppData();
    const [trackLocationRecordList, setTrackLocationRecordList] = useState([]);

    useEffect(() => {
        ( async () => {
            if (currentTimelineItem) {
                let locationRecordsData = await getLocationRecordsByRangeAsync(
                    mobileDevice.id,
                    currentTimelineItem.beginDate,
                    currentTimelineItem.endDate
                ) ?? [];
                setTrackLocationRecordList(locationRecordsData);
            }
        } )()
    }, [currentTimelineItem, getLocationRecordsByRangeAsync, mobileDevice.id]);

    return (
        <TrackMapLocationRecordsContext.Provider
            value={ { trackLocationRecordList } }
            { ...props }
        />
    );
}

TrackMapLocationRecordsProvider.propTypes = {
    props: PropTypes.shape(
        { mobileDevice: PropTypes.shape({ id: PropTypes.number.isRequired }) }
    )
}

export { TrackMapLocationRecordsProvider, useTrackMapLocationRecordsContext };
