import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAppData } from '../../../../contexts/app-data';
import { useAppSettings } from '../../../../contexts/app-settings';

const TrackMapTimelineContext = createContext({});
const useTrackMapTimelineContext = () => useContext(TrackMapTimelineContext);

function TrackMapTimelineProvider (props) {
    const { mobileDevice, workDate } = props;
    const { getTimelinesAsync } = useAppData();
    const { appSettingsData,getDailyTimelineItem } = useAppSettings();
    const [currentTimeline, setCurrentTimeline] = useState([]);
    const [currentTimelineItem, setCurrentTimelineItem] = useState(null);


    useEffect(() => {
        ( async () => {
            const timelineItem = getDailyTimelineItem(workDate);
            let timeline = await getTimelinesAsync(mobileDevice.id, workDate ?? appSettingsData.workDate) ?? [];
            timeline = ( [timelineItem, ...timeline] ).map(t => {
                t.endDate.setTime(t.endDate.getTime() - 1000);
                return t;
            } );
            setCurrentTimeline(timeline );
            setCurrentTimelineItem(timelineItem)
        } )();
    }, [appSettingsData.workDate, getDailyTimelineItem, getTimelinesAsync, mobileDevice.id, workDate]);

    return (
        <TrackMapTimelineContext.Provider value={ { currentTimeline, currentTimelineItem, setCurrentTimelineItem } }  { ...props } />
    )
}

TrackMapTimelineProvider.propTypes = {
    props: PropTypes.shape(
        { mobileDevice: PropTypes.shape({ id: PropTypes.number.isRequired }) }
    )
}

export { TrackMapTimelineProvider, useTrackMapTimelineContext }
