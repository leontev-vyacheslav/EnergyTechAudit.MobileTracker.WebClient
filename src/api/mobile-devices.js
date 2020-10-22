import appConstants from '../constants/app-constants'
import { fetchWithCredentials } from './base';

export function getMobileDevices () {
    return fetchWithCredentials(`${ appConstants.routes.host }${ appConstants.routes.mobileDevices }`, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        },
    }).then(response => response.json());
}

export async function getTimelinesAsync (mobileDeviceId, workDate) {
    const response = await fetchWithCredentials(`${ appConstants.routes.host }${ appConstants.routes.timeline }?mobileDeviceId=${ mobileDeviceId }&workDate=${ new Date(workDate).toISOString() }`, {
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

export async function getLocationRecordsAsync (mobileDeviceId, workDate) {
    const response = await fetchWithCredentials(`${ appConstants.routes.host }${ appConstants.routes.locationRecord }/${ mobileDeviceId }?workDate=${ new Date(workDate).toISOString() }`, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        },
    }).catch((error) => {
        return Promise.reject(error);
    });

    return await response.json().catch((error) => {
        return Promise.reject(error);
    });
}

export async function getLocationRecordsByRangeAsync (mobileDeviceId, beginDate, endDate) {
    const response = await fetchWithCredentials(`${ appConstants.routes.host }${ appConstants.routes.locationRecord }/byRange/${ mobileDeviceId }?beginDate=${ new Date(beginDate).toISOString() }&endDate=${ new Date(endDate).toISOString() }`, {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        },
    }).catch((error) => {
        return Promise.reject(error);
    });

    return await response.json().catch((error) => {
        return Promise.reject(error);
    });
}
