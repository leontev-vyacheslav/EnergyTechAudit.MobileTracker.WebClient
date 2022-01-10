import { Dispatch, SetStateAction } from 'react';

export type TrackMapSettingsContextModel = {
  isShowTrackMapSettings: boolean,
  setIsShowTrackMapSettings: Dispatch<SetStateAction<boolean>>,
  isShowTrackMapZones: boolean,
  setIsShowTrackMapZones: Dispatch<SetStateAction<boolean>>,
  isShowStationaryZone: boolean,
  setIsShowStationaryZone: Dispatch<SetStateAction<boolean>>,
  isShowTrackMapTimeline: boolean,
  setIsShowTrackMapTimeline: Dispatch<SetStateAction<boolean>>
}
