import { MobileDeviceWorkDateModel } from './mobile-device-work-date-model';
import React, { Dispatch, ReactNode } from 'react';
import { TimelineModel } from './timeline';

export type TrackMapTimelineProviderProps = MobileDeviceWorkDateModel & { children: ReactNode }

export type TrackMapTimelineContextModel = {
  currentTimeline: TimelineModel[],
  currentTimelineItem: TimelineModel | null,
  setCurrentTimelineItem: Dispatch<React.SetStateAction<TimelineModel | null>>
}
