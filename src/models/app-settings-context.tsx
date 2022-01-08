import { Dispatch, SetStateAction } from 'react';
import { TimelineModel } from './timeline';

export type AppSettingsDataContextModel = {
  workDate: Date,
  breakInterval: number,
  isShownBreakInterval: boolean,
  minimalAccuracy: number,
  stationaryZoneRadius: number,
  stationaryZoneElementCount: number,
  stationaryZoneCriteriaSpeed: number,
  stationaryZoneCriteriaAccuracy: number,
  useStationaryZoneCriteriaAccuracy: boolean,
  useStationaryZoneAddressesOnMap: boolean,
  useStationaryZoneAddressesOnList: boolean,
  isShowFooter: boolean,
}

export type AppSettingsContextModel = {
  appSettingsData: AppSettingsDataContextModel,
  setAppSettingsData: Dispatch<SetStateAction<AppSettingsDataContextModel>>,
  getDailyTimelineItem: (date?: Date) => TimelineModel,
  setWorkDateToday: () => void
};
