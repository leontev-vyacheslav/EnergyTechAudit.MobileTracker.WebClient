import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AppDataContextModel, useAppData } from '../../../../contexts/app-data';
import { useTrackMapTimelineContext } from './track-map-timeline-context';
import { TrackMapLocationRecordsProviderProps } from '../../../../models/track-map-location-records-provider-props';

const TrackMapLocationRecordsContext = createContext({});

const useTrackMapLocationRecordsContext = () => useContext(TrackMapLocationRecordsContext);

function TrackMapLocationRecordsProvider (props: TrackMapLocationRecordsProviderProps) {

    const { mobileDevice } = props;
    const { currentTimelineItem }: any = useTrackMapTimelineContext();
    const { getLocationRecordsByRangeAsync }: AppDataContextModel = useAppData();
    const [trackLocationRecordList, setTrackLocationRecordList] = useState([]);

    useEffect(() => {
        ( async () => {
            if (currentTimelineItem && mobileDevice) {
                const locationRecordsData = await getLocationRecordsByRangeAsync(
                    mobileDevice.id,
                    currentTimelineItem.beginDate,
                    currentTimelineItem.endDate
                ) ?? [];
                setTrackLocationRecordList(locationRecordsData);
            }
        } )()
    }, [currentTimelineItem, getLocationRecordsByRangeAsync, mobileDevice]);

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
