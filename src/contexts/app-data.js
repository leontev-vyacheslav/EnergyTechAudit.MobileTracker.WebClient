import React, { createContext, useCallback, useContext, useMemo } from 'react';
import appConstants from '../constants/app-constants';

import { useAuth } from './auth';

function AppDataProvider (props) {

    const { signOut, refreshTokenAsync, getUserAuthDataFromStorage } = useAuth();

    const defaultHeaders = useMemo(() => { return {
        Accept: 'application/json'
    }}, []);

    const fetchWithCredentials = useCallback(async (url, options) => {
        let userAuthData = getUserAuthDataFromStorage();

        if (userAuthData) {
            options = options || {};
            options.headers = defaultHeaders;
            options.headers['Authorization'] = `Bearer ${ userAuthData.token }`;
            let response = await fetch(url, options).catch(e => {
                console.warn(e);
            });
            if (response.ok) {
                return response;
            }

            if (response.status === 401 && response.headers.has('Expires')) {

                const refreshResponse = await refreshTokenAsync();
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
        }
        else {
            signOut();
            return Promise.reject();
        }
    }, [signOut, refreshTokenAsync, defaultHeaders, getUserAuthDataFromStorage]);

    const getMobileDevices = useCallback(async () => {

        const response = await fetchWithCredentials(`${ appConstants.routes.host }${ appConstants.routes.mobileDevices }`, {
            method: 'GET'
        }).catch((error) => {
            return Promise.reject(error);
        });

        if(response) {
            return response.json().catch((error) => {
                return Promise.reject(error);
            });
        }
        else {
            return Promise.reject(new Error('Internal error'));
        }

    }, [fetchWithCredentials]);

    const getTimelinesAsync = useCallback(async (mobileDeviceId, workDate) => {
        const response = await fetchWithCredentials(`${ appConstants.routes.host }${ appConstants.routes.timeline }?mobileDeviceId=${ mobileDeviceId }&workDate=${ new Date(workDate).toISOString() }`, {
            method: 'GET'
        }).catch((error) => {
            return Promise.reject(error);
        });

        if(response) {
            return response.json().catch((error) => {
                return Promise.reject(error);
            });
        }
        else {
            return Promise.reject(new Error('Internal error'));
        }
    }, [fetchWithCredentials]);

    const getLocationRecordsAsync = useCallback(async (mobileDeviceId, workDate) => {
        const response = await fetchWithCredentials(`${ appConstants.routes.host }${ appConstants.routes.locationRecord }/${ mobileDeviceId }?workDate=${ new Date(workDate).toISOString() }`, {
            method: 'GET'
        }).catch((error) => {
            return Promise.reject(error);
        });

        if(response) {
            return response.json().catch((error) => {
                return Promise.reject(error);
            });
        }
        else {
            return Promise.reject(new Error('Internal error'));
        }
    }, [fetchWithCredentials]);

    const getLocationRecordsByRangeAsync = useCallback(async (mobileDeviceId, beginDate, endDate) => {
        const response = await fetchWithCredentials(`${ appConstants.routes.host }${ appConstants.routes.locationRecord }/byRange/${ mobileDeviceId }?beginDate=${ new Date(beginDate).toISOString() }&endDate=${ new Date(endDate).toISOString() }`, {
            method: 'GET'
        }).catch((error) => {
            return Promise.reject(error);
        });

        if(response) {
            return response.json().catch((error) => {
                return Promise.reject(error);
            });
        }
        else {
            return Promise.reject(new Error('Internal error'));
        }
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
