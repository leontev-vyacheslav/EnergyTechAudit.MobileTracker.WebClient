import React, { createContext, useContext, useEffect, useState } from 'react';
import {  useAppData } from '../../../../contexts/app-data';
import { useAppSettings } from '../../../../contexts/app-settings';
import { TimelineModel } from '../../../../models/timeline';
import {
    TrackMapTimelineContextModel,
    TrackMapTimelineProviderProps
} from '../../../../models/track-map-timeline-provider-props';

const TrackMapTimelineContext = createContext<TrackMapTimelineContextModel>({} as TrackMapTimelineContextModel);
const useTrackMapTimelineContext = () => useContext(TrackMapTimelineContext);

function TrackMapTimelineProvider (props: TrackMapTimelineProviderProps) {
    const { mobileDevice, workDate } = props;
    const { getTimelinesAsync } = useAppData();
    const { appSettingsData, getDailyTimelineItem } = useAppSettings();
    const [currentTimeline, setCurrentTimeline] = useState<TimelineModel[]>([]);
    const [currentTimelineItem, setCurrentTimelineItem] = useState<TimelineModel | null>(null);

    useEffect(() => {
        ( async () => {
            const timelineItem = getDailyTimelineItem(workDate);

            if(mobileDevice) {
                let timeline = await getTimelinesAsync(mobileDevice.id, workDate ?? appSettingsData.workDate) ?? [];
                timeline = ([timelineItem as TimelineModel, ...timeline]).map(t => {
                    t.endDate.setTime(t.endDate.getTime() - 1000);
                    return t;
                });
                setCurrentTimeline(timeline);
                setCurrentTimelineItem(timelineItem)
            }
        } )();
    }, [appSettingsData.workDate, getDailyTimelineItem, getTimelinesAsync, mobileDevice, workDate]);

    return (
        <TrackMapTimelineContext.Provider value={ { currentTimeline, currentTimelineItem, setCurrentTimelineItem } }  { ...props } />
    )
}

export { TrackMapTimelineProvider, useTrackMapTimelineContext }
