import appConstants from  '../constants/app-constants'

export function getMobileDevices() {
    return fetch(`${appConstants.routes.host}${appConstants.routes.mobileDevices}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiZXRhLm9wZXIubGVvIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiTU9CSUxFX0RFVklDRV9VU0VSIiwibmJmIjoxNjAyNDgzMTAyLCJleHAiOjE2MDI2NjMxMDIsImlzcyI6IkVuZXJneVRlY2hBdWRpdC5Nb2JpbGVUcmFja2VyLldlYiIsImF1ZCI6IkVuZXJneVRlY2hBdWRpdC5Nb2JpbGVUcmFja2VyLkNsaWVudCJ9._rUe4O4PxNB-rhckvKwVUG_C-2pRKEvQxffcA8KtTXY'
        },
    }).then(response => response.json());
}

export function getTimelines(mobileDeviceId, workDate) {
    return fetch(`${appConstants.routes.host}${appConstants.routes.timeline}?mobileDeviceId=${mobileDeviceId}&workDate=${new Date(workDate).toISOString() }`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiZXRhLm9wZXIubGVvIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiTU9CSUxFX0RFVklDRV9VU0VSIiwibmJmIjoxNjAyNDgzMTAyLCJleHAiOjE2MDI2NjMxMDIsImlzcyI6IkVuZXJneVRlY2hBdWRpdC5Nb2JpbGVUcmFja2VyLldlYiIsImF1ZCI6IkVuZXJneVRlY2hBdWRpdC5Nb2JpbGVUcmFja2VyLkNsaWVudCJ9._rUe4O4PxNB-rhckvKwVUG_C-2pRKEvQxffcA8KtTXY'
        },
    }).then(response => response.json());
}
