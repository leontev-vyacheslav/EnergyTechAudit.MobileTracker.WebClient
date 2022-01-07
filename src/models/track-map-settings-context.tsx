import React, { Dispatch } from 'react';

export type TrackMapSettingsContextModel = {
  isShowTrackMapSettings: boolean,
  setIsShowTrackMapSettings: Dispatch<React.SetStateAction<boolean>>,
  isShowTrackMapZones: boolean,
  setIsShowTrackMapZones: Dispatch<React.SetStateAction<boolean>>,
  isShowStationaryZone: boolean,
  setIsShowStationaryZone: Dispatch<React.SetStateAction<boolean>>,
  isShowTrackMapTimeline: boolean,
  setIsShowTrackMapTimeline: Dispatch<React.SetStateAction<boolean>>
}
