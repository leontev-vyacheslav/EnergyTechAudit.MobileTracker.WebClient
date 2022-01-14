import { Entity } from './entity';

export interface LocationRecordDataModel extends Entity
{
  mobileDeviceId: number,
  trackerEventId: number | null,
  isMoving: boolean,
  latitude: number,
  longitude: number,
  accuracy: number,
  speed: number,
  speedAccuracy: number,
  heading: number,
  headingAccuracy: number,
  altitude: number,
  altitudeAccuracy: number,
  serverDateTime: Date
  mobileDeviceDateTime: Date,
  motionActivityTypeId: number,
  motionActivityTypeConfidence: number
  batteryLevel: number,
  isCharging: boolean
}
