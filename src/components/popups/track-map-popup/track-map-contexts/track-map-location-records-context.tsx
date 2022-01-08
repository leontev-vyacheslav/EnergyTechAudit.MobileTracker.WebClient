import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppDataContextModel, useAppData } from '../../../../contexts/app-data';
import { useTrackMapTimelineContext } from './track-map-timeline-context';
import { TrackMapLocationRecordsProviderProps } from '../../../../models/track-map-location-records-provider-props';
import {
    TrackLocationRecordModel,
    TrackMapLocationRecordsContextModel
} from '../../../../models/track-location-record';
import { TrackMapTimelineContextModel } from '../../../../models/track-map-timeline-provider-props';


const TrackMapLocationRecordsContext = createContext<TrackMapLocationRecordsContextModel>({} as TrackMapLocationRecordsContextModel);

const useTrackMapLocationRecordsContext = () => useContext(TrackMapLocationRecordsContext);

function TrackMapLocationRecordsProvider (props: TrackMapLocationRecordsProviderProps) {

    const { mobileDevice } = props;
    const { currentTimelineItem }: TrackMapTimelineContextModel = useTrackMapTimelineContext();
    const { getLocationRecordsByRangeAsync }: AppDataContextModel = useAppData();
    const [trackLocationRecordList, setTrackLocationRecordList] = useState<TrackLocationRecordModel[]>([]);

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

export { TrackMapLocationRecordsProvider, useTrackMapLocationRecordsContext };
