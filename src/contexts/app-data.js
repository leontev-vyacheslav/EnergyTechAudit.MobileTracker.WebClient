import React, { createContext, useCallback, useContext } from 'react';
import appConstants from '../constants/app-constants';

import { useAuth } from './auth';

function AppDataProvider (props) {

    const { signOut, refreshTokenAsync } = useAuth();

    const fetchWithCredentials = useCallback(async (url, options) => {

        const userAuthDataStr = localStorage.getItem('userAuthData');
        let userAuthData ;
        try {
            if (userAuthDataStr) {
                userAuthData = JSON.parse(userAuthDataStr);
            }
        }
        catch (e) {
            console.error(e);
            userAuthData = null;
        }

        if (!userAuthData) {
            signOut();
            return ;
        }

        options = options || {};
        options.headers = options.headers || {};
        options.headers['Authorization'] = `Bearer ${ userAuthData.token }`;
        let response = await fetch(url, options).catch(e => {
            console.warn(e);
        });
        if (response.ok) {
            return response;
        }

        if (response.status === 401 && response.headers.has('Expires')) {

            const refreshResponse = await refreshTokenAsync(userAuthData.token, userAuthData.refreshToken);
            if (!refreshResponse.ok) {
                signOut();
                return refreshResponse;
            }
            const jsonRefreshResponse = await refreshResponse.json();
            localStorage.setItem('userAuthData', JSON.stringify(jsonRefreshResponse));

            return await fetchWithCredentials(url, options);
        } else {
            return response;
        }
    }, [signOut, refreshTokenAsync]);

    const getMobileDevices = useCallback(() => {
        return fetchWithCredentials(`${ appConstants.routes.host }${ appConstants.routes.mobileDevices }`, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            },
        }).then(response => response.json());
    }, [fetchWithCredentials]);

    const getTimelinesAsync = useCallback(async (mobileDeviceId, workDate) => {
        const response = await fetchWithCredentials(`${ appConstants.routes.host }${ appConstants.routes.timeline }?mobileDeviceId=${ mobileDeviceId }&workDate=${ new Date(workDate).toISOString() }`, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${ appConstants.testToken }`
            },
        }).catch((error) => {
            return Promise.reject(error);
        });

        return response.json().catch((error) => {
            return Promise.reject(error);
        });
    }, [fetchWithCredentials]);

    const getLocationRecordsAsync = useCallback(async (mobileDeviceId, workDate) => {
        const response = await fetchWithCredentials(`${ appConstants.routes.host }${ appConstants.routes.locationRecord }/${ mobileDeviceId }?workDate=${ new Date(workDate).toISOString() }`, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            },
        }).catch((error) => {
            return Promise.reject(error);
        });

        return response.json().catch((error) => {
            return Promise.reject(error);
        });
    }, [fetchWithCredentials]);

    const getLocationRecordsByRangeAsync = useCallback(async (mobileDeviceId, beginDate, endDate) => {
        const response = await fetchWithCredentials(`${ appConstants.routes.host }${ appConstants.routes.locationRecord }/byRange/${ mobileDeviceId }?beginDate=${ new Date(beginDate).toISOString() }&endDate=${ new Date(endDate).toISOString() }`, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            },
        }).catch((error) => {
            return Promise.reject(error);
        });

        return response.json().catch((error) => {
            return Promise.reject(error);
        });
    }, [fetchWithCredentials]);

    return (
        <AppDataContext.Provider value={
            {
                getMobileDevices,
                getTimelinesAsync,
                getLocationRecordsAsync,
                getLocationRecordsByRangeAsync
            }
        } { ...props } />
    );
}

const AppDataContext = createContext({});
const useAppData = () => useContext(AppDataContext);

export { AppDataProvider, useAppData }
