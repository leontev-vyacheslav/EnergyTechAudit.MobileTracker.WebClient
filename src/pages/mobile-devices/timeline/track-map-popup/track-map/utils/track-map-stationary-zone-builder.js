import geocluster from '../../../../../../components/geocluster';
import { getBoundsByMarkers } from './track-map-utils'
import AppConstants from '../../../../../../constants/app-constants';

export const stationaryClusterCircleDefaultProps = {
    strokeColor: AppConstants.trackMap.stationaryCircleColor,
    strokeOpacity: AppConstants.trackMap.stationaryCircleStrokeOpacity,
    strokeWeight: AppConstants.trackMap.stationaryCircleStrokeWeight,
    fillColor: AppConstants.trackMap.stationaryCircleColor,
    fillOpacity: AppConstants.trackMap.stationaryCircleFillOpacity,
};

export const showStationaryClusters = (currentMapInstance, trackLocationRecordList) => {

    const geoClusterData = trackLocationRecordList
        .filter(locationRecord => locationRecord.speed < 4)
        .map(locationRecord => [locationRecord.latitude, locationRecord.longitude]);

    const stationaryClusters = [];

    let { bias, defaultRadius, pointCount } = {
        bias: 1.25,
        defaultRadius: 100,
        pointCount: 7
    };

    const getFilteredClusters = () => {
        const clusters = geocluster(geoClusterData, bias);
        return clusters
            .sort((c1, c2) => c2.elements.length - c1.elements.length)
            .filter(c => c.elements.length > pointCount);
    };

    let filteredClusters = getFilteredClusters();

    filteredClusters
        .forEach(c => {
            const [lat, lng] = c.centroid;

            const boundBox = getBoundsByMarkers(c.elements.map(element => {
                const [lat, lng] = element;
                return {
                    latitude: lat,
                    longitude: lng
                };
            }));
            let radius = defaultRadius;
            if (boundBox) {
                const diagonalDistance = window.google.maps.geometry.spherical.computeDistanceBetween(
                    boundBox.getNorthEast(),
                    boundBox.getSouthWest()
                );
                radius = diagonalDistance / 2 < defaultRadius ? defaultRadius : diagonalDistance / 2;
            }

            const circleProps = {
                ...{
                    radius: radius, center: new window.google.maps.LatLng({
                        lat: lat,
                        lng: lng
                    })
                }, ...stationaryClusterCircleDefaultProps
            };

            const circle = new window.google.maps.Circle(circleProps);
            circle.setMap(currentMapInstance);
            stationaryClusters.push(circle);
        });

    return stationaryClusters;
}
