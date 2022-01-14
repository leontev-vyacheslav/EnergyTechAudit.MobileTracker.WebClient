import { TrackLocationRecordModel } from './track-location-record';
import { Entity } from './entity';

export interface Cluster extends  Entity {
  index: number,
  centroid: google.maps.LatLngBounds | google.maps.LatLng | null,
  radius: number,
  elements: (number |  TrackLocationRecordModel)[][],
  count: number,
  addresses: string[],
  speed: number,
  accuracy: number
}
