import { Cluster } from './cluster';
import { Dispatch, SetStateAction } from 'react';

export type ShowInfoWindowAsyncFunc = (clusterIndex: number) => Promise<void>;

export type TrackMapStationaryZonesContextModel = {
  showInfoWindowAsync: ShowInfoWindowAsyncFunc,
  stationaryClusterList: Cluster[],
  currentStationaryCluster: Cluster | null,
  setCurrentStationaryCluster: Dispatch<SetStateAction<Cluster | null>>,
}
