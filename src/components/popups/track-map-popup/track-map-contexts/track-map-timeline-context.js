import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAppData } from '../../../../contexts/app-data';
import { useAppSettings } from '../../../../contexts/app-settings';

const TrackMapTimelineContext = createContext({});
const useTrackMapTimelineContext = () => useContext(TrackMapTimelineContext);

function TrackMapTimelineProvider (props) {
    const { mobileDevice } = props;
    const { getTimelinesAsync } = useAppData();
    const { appSettingsData,getDailyTimelineItem } = useAppSettings();
    const [currentTimeline, setCurrentTimeline] = useState([]);
    const [currentTimelineItem, setCurrentTimelineItem] = useState(null);

    useEffect(() => {
        ( async () => {
            const timelineItem = getDailyTimelineItem();
            let timeline = await getTimelinesAsync(mobileDevice.id, appSettingsData.workDate) ?? [];
            timeline = ( [timelineItem, ...timeline] ).map(t => {
                t.endDate.setTime(t.endDate.getTime() - 1000);
                return t;
            } );
            setCurrentTimeline(timeline );
            setCurrentTimelineItem(timelineItem);
        } )();
    }, [getTimelinesAsync, mobileDevice.id, appSettingsData.workDate, getDailyTimelineItem]);

    return (
        <TrackMapTimelineContext.Provider value={ { currentTimeline, currentTimelineItem, setCurrentTimelineItem } }  { ...props } />
    )
}

export { TrackMapTimelineProvider, useTrackMapTimelineContext }
