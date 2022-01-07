import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AppDataContextModel, useAppData } from '../../../../contexts/app-data';
import { useAppSettings } from '../../../../contexts/app-settings';
import { AppSettingsContextModel } from '../../../../models/app-settings-context';
import { MobileDeviceWorkDateModel } from '../../../../models/mobile-device-work-date-model';
import { TimelineModel } from '../../../../models/timeline';

export type TrackMapTimelineProviderProps = MobileDeviceWorkDateModel & { children: ReactNode }

const TrackMapTimelineContext = createContext({});
const useTrackMapTimelineContext = () => useContext(TrackMapTimelineContext);

function TrackMapTimelineProvider (props: TrackMapTimelineProviderProps) {
    const { mobileDevice, workDate } = props;
    const { getTimelinesAsync }: AppDataContextModel = useAppData();
    const { appSettingsData, getDailyTimelineItem }: AppSettingsContextModel = useAppSettings();
    const [currentTimeline, setCurrentTimeline] = useState<TimelineModel[]>([]);
    const [currentTimelineItem, setCurrentTimelineItem] = useState<any>(null);


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

TrackMapTimelineProvider.propTypes = {
    props: PropTypes.shape(
        { mobileDevice: PropTypes.shape({ id: PropTypes.number.isRequired }) }
    )
}

export { TrackMapTimelineProvider, useTrackMapTimelineContext }
