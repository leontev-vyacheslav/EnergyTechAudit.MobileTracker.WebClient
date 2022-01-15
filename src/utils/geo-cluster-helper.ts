import { DBSCAN } from 'density-clustering';
import { SphericalCalculator } from './spherical';
import { TrackLocationRecordModel } from '../models/track-location-record';
import { AppSettingsMapModel } from '../models/app-settings-context';

const getGeoClusters = (locationRecordsData: TrackLocationRecordModel[], options: AppSettingsMapModel) => {
    const {
        stationaryZoneRadius,
        stationaryZoneElementCount,
        stationaryZoneCriteriaSpeed,
        stationaryZoneCriteriaAccuracy,
        useStationaryZoneCriteriaAccuracy
    } = options;

    const geoClusterData: any = locationRecordsData
        .filter(locationRecord =>
            locationRecord.speed < stationaryZoneCriteriaSpeed &&
            (!useStationaryZoneCriteriaAccuracy || locationRecord.accuracy < stationaryZoneCriteriaAccuracy)
        )
        .map(locationRecord => [locationRecord.latitude, locationRecord.longitude, locationRecord]);

    const dbscan = new DBSCAN();

    const clustersIndexes = dbscan.run(geoClusterData,
        stationaryZoneRadius,
        stationaryZoneElementCount,
        SphericalCalculator.computeDistanceBetween2
    );

    return clustersIndexes.map((clusterIndexes) => clusterIndexes.map((pointId) => geoClusterData[pointId]));
}

export { getGeoClusters };
