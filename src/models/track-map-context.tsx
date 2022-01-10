import { TrackLocationRecordModel } from './track-location-record';
import { Dispatch, SetStateAction } from 'react';
import { ProcFunc } from './primitive-type';
import { LocationRecordDataModel } from './location-record-data';

export type GetBoundsByMarkersFunc = (trackLocationList: TrackLocationRecordModel[]) => (google.maps.LatLngBounds | null);

export type BuildInfoWindowFunc = (locationRecord: LocationRecordDataModel, content: any) => (google.maps.InfoWindow | null);

export type TrackMapTrackContextModel = {
  currentMapInstance: google.maps.Map | null,
  setCurrentMapInstance: Dispatch<SetStateAction<google.maps.Map | null>>,
  getBoundsByMarkers: GetBoundsByMarkersFunc,
  buildInfoWindow: BuildInfoWindowFunc,
  fitMapBoundsByLocations: ProcFunc,
  closeInfoWindow: ProcFunc
}
