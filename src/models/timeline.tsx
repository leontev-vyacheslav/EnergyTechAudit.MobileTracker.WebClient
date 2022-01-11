import { LocationRecordDataModel } from './location-record-data';

export type TimelineModel = {
  id: number,
  beginDate: Date,
  endDate: Date,
  distance: number,
  averageSpeed: number,
  averageAccuracy: number,
  bestAccuracy: number,
  worstAccuracy: number,
  totalAmountLocations: number,
  valuableAmountLocations: number,
  takeAccountOutsidePoints: boolean,
  largestInterval: number,
  smallestInterval: number,
  hasGap: boolean,
  active: boolean,
  firstLocationRecord: LocationRecordDataModel | null,
  lastLocationRecord: LocationRecordDataModel | null
}
