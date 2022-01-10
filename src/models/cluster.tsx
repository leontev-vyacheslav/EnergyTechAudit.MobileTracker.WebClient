import { TrackLocationRecordModel } from './track-location-record';

export type Cluster = {
  id: number,
  index: number,
  centroid: google.maps.LatLngBounds | google.maps.LatLng | null,
  radius: number,
  elements: (number |  TrackLocationRecordModel)[][],
  count: number,
  addresses: string[],
  speed: number,
  accuracy: number
}
