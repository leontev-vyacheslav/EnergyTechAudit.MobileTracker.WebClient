import { LocationRecordDataModel } from './location-record-data';
import { Entity } from './entity';

export interface TimelineModel extends Entity {
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
