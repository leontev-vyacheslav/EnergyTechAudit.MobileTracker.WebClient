import { Entity } from './entity';

export interface DailyCoveredDistanceModel extends Entity {
  id: number,
  mobileDeviceId: number,
  userId: number,
  date: Date,
  distance: number
  averageAccuracy: number
  samplesNumber: number
}
