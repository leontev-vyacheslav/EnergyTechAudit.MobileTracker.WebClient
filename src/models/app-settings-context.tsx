import { Dispatch, SetStateAction } from 'react';
import { TimelineModel } from './timeline';
import { ProcFunc } from './primitive-type';

export type AppSettingsMapModel = {
  stationaryZoneRadius: number,
  stationaryZoneElementCount: number,
  stationaryZoneCriteriaSpeed: number,
  stationaryZoneCriteriaAccuracy: number,
  useStationaryZoneCriteriaAccuracy: boolean,
}

export type AppSettingsModel = {
  workDate: Date,
  breakInterval: number,
  isShownBreakInterval: boolean,
  minimalAccuracy: number,
  useStationaryZoneAddressesOnMap: boolean,
  useStationaryZoneAddressesOnList: boolean,
  isShowFooter: boolean,
}

export type AppSettingsDataContextModel = AppSettingsModel & AppSettingsMapModel;

export type AppSettingsContextModel = {
  appSettingsData: AppSettingsDataContextModel,
  setAppSettingsData: Dispatch<SetStateAction<AppSettingsDataContextModel>>,
  getDailyTimelineItem: (date?: Date) => TimelineModel,
  setWorkDateToday: ProcFunc
}
