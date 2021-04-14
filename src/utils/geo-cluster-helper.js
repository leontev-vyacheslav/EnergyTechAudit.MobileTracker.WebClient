import { DBSCAN } from 'density-clustering';
import { SphericalCalculator } from './spherical';

const getGeoClusters = (locationRecordsData, options) => {
    const {
        stationaryZoneRadius,
        stationaryZoneElementCount,
        stationaryZoneCriteriaSpeed,
        stationaryZoneCriteriaAccuracy,
        useStationaryZoneCriteriaAccuracy
    } = options;

    const geoClusterData = locationRecordsData
        .filter(locationRecord =>
            locationRecord.speed < stationaryZoneCriteriaSpeed &&
            ( !useStationaryZoneCriteriaAccuracy === true || locationRecord.accuracy < stationaryZoneCriteriaAccuracy )
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
