import { TrackLocationRecordModel } from './track-location-record';
import { Dispatch, SetStateAction } from 'react';
import { ProcFunc } from './primitive-type';

export type GetBoundsByMarkersFunc = (trackLocationList: TrackLocationRecordModel[]) => (google.maps.LatLngBounds | null);

export type BuildInfoWindowFunc = (locationRecord: any, content: any) => (google.maps.InfoWindow | null);

export type TrackMapTrackContextModel = {
  currentMapInstance: google.maps.Map | null,
  setCurrentMapInstance: Dispatch<SetStateAction<google.maps.Map | null>>,
  getBoundsByMarkers: GetBoundsByMarkersFunc,
  buildInfoWindow: BuildInfoWindowFunc,
  fitMapBoundsByLocations: ProcFunc,
  closeInfoWindow: ProcFunc
}
