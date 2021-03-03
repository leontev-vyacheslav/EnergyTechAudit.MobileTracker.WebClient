import AppConstants from '../../../../../../constants/app-constants';

export const getBoundsByMarkers = (locationList) => {
    const boundBox = new window.google.maps.LatLngBounds();
    for (let i = 0; i < locationList.length; i++) {
        boundBox.extend({
            lat: locationList[i].latitude,
            lng: locationList[i].longitude
        });
    }
    return boundBox;
}

export const fitMapBoundsByLocations = (currentMapInstance, locationList) => {
    if (locationList && locationList.length > 0) {
        const boundBox = getBoundsByMarkers(locationList);
        if (boundBox) {
            currentMapInstance.setCenter(boundBox.getCenter());
            currentMapInstance.fitBounds(boundBox);
        }
    }
};

export const centerMapByInfoWindow = (currentMapInstance, infoWindow) => {
    if (infoWindow) {
        const currentZoom = currentMapInstance.getZoom();
        if (currentZoom <= AppConstants.trackMap.defaultZoom) {
            currentMapInstance.setZoom(AppConstants.trackMap.defaultZoom);
        }
        currentMapInstance.setCenter(infoWindow.getPosition());
    }
};

export const buildInfoWindow = (currentMapInstance, content, locationRecord) => {

    const infoWindow = new window.google.maps.InfoWindow({
        position: {
            lat: locationRecord.latitude,
            lng: locationRecord.longitude
        },
        content: content,
    });

    currentMapInstance.setCenter({
        lat: locationRecord.latitude,
        lng: locationRecord.longitude
    });
    const currentZoom = currentMapInstance.getZoom();
    if (currentZoom <= AppConstants.trackMap.defaultZoom) {
        currentMapInstance.setZoom(AppConstants.trackMap.defaultZoom);
    }
    infoWindow.open(currentMapInstance);
    return infoWindow;
}
