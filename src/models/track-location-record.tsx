import { Entity } from './entity';

export type TrackMapLocationRecordsContextModel = {
  trackLocationRecordList: TrackLocationRecordModel[]
}

export interface TrackLocationRecordModel extends Entity {
  accuracy: number,
  heading: number,
  speed: number,
  mobileDeviceDateTime: Date,
  latitude: number,
  longitude: number
}

