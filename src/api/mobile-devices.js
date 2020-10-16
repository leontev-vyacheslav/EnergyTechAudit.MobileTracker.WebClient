import appConstants from '../constants/app-constants'

export function getMobileDevices () {
    return fetch(`${ appConstants.routes.host }${ appConstants.routes.mobileDevices }`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${ appConstants.testToken }`
        },
    }).then(response => response.json());
}

export async function getTimelinesAsync (mobileDeviceId, workDate) {
    const response = await fetch(`${ appConstants.routes.host }${ appConstants.routes.timeline }?mobileDeviceId=${ mobileDeviceId }&workDate=${ new Date(workDate).toISOString() }`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${ appConstants.testToken }`
        },
    }).catch((error) => {
        return Promise.reject(error);
    });

    return await response.json().catch((error) => {
        return Promise.reject(error);
    });
}
