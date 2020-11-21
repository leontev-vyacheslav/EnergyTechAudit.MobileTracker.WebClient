import React, { createContext, useCallback, useContext, useMemo } from 'react';
import routes from '../constants/routes';
import { useAuth } from './auth';
import { useSharedArea } from './shared-area';

function AppDataProvider (props) {
    const { signOut, refreshTokenAsync, getUserAuthDataFromStorage } = useAuth();
    const { loaderRef } = useSharedArea();

    const defaultHeaders = useMemo(() => {
        return {
            Accept: 'application/json',
        };
    }, []);

    const hideLoader = useCallback(() => {
        setTimeout(() => {
            if (loaderRef.current) {
                loaderRef.current.instance.hide();
                console.log('The loading indicator has been hidden just now.');
            }
        }, 250);
    }, [loaderRef]);

    const showLoader = useCallback(() => {
        if (loaderRef.current) {
            loaderRef.current.instance.show();
            console.log('The loading indicator was shown.');
        }
    }, [loaderRef]);

    const fetchWithCredentials = useCallback(
        async (url, options) => {
            let userAuthData = getUserAuthDataFromStorage();
            if (userAuthData) {
                options = options || {};
                options.headers = options.headers || {};
                options.headers = { ...options.headers, ...defaultHeaders };
                options.headers.Authorization = `Bearer ${ userAuthData.token }`;
                showLoader();
                let response = await fetch(url, options).catch((e) => {
                    console.warn(e);
                    hideLoader();
                    return Promise.reject(e);
                });
                if (response.ok) {
                    hideLoader();
                    return response;
                }
                if (response.status === 401 && response.headers.has('Expires')) {
                    const refreshResponse = await refreshTokenAsync();
                    if (!refreshResponse.ok) {
                        signOut();
                        hideLoader();
                        return Promise.reject();
                    }
                    const jsonRefreshResponse = await refreshResponse.json();
                    localStorage.setItem('userAuthData', JSON.stringify(jsonRefreshResponse));
                    hideLoader();
                    return await fetchWithCredentials(url, options);
                } else {
                    hideLoader();
                    return response;
                }
            } else {
                signOut();
                hideLoader();
                return Promise.reject();
            }
        },
        [getUserAuthDataFromStorage, defaultHeaders, showLoader, hideLoader, refreshTokenAsync, signOut],
    );

    const getMobileDevices = useCallback(async () => {
        const response = await fetchWithCredentials(`${ routes.host }${ routes.mobileDevices }`, {
            method: 'GET',
        }).catch((error) => {
            return Promise.reject(error);
        });

        if (response) {
            return response.json().catch((error) => {
                return Promise.reject(error);
            });
        } else {
            return Promise.reject(new Error('Internal error'));
        }
    }, [fetchWithCredentials]);

    const getTimelinesAsync = useCallback(
        async (mobileDeviceId, workDate) => {
            const response = await fetchWithCredentials(
                `${ routes.host }${ routes.timeline }?mobileDeviceId=${ mobileDeviceId }&workDate=${ new Date(
                    workDate,
                ).toISOString() }`,
                {
                    method: 'GET',
                },
            ).catch((error) => {
                return Promise.reject(error);
            });

            if (response) {
                return response.json().catch((error) => {
                    return Promise.reject(error);
                });
            } else {
                return Promise.reject(new Error('Internal error'));
            }
        },
        [fetchWithCredentials],
    );

    const getLocationRecordsAsync = useCallback(
        async (mobileDeviceId, workDate) => {
            const response = await fetchWithCredentials(
                `${ routes.host }${ routes.locationRecord }/${ mobileDeviceId }?workDate=${ new Date(workDate).toISOString() }`,
                {
                    method: 'GET',
                },
            ).catch((error) => {
                return Promise.reject(error);
            });

            if (response) {
                return response.json().catch((error) => {
                    return Promise.reject(error);
                });
            } else {
                return Promise.reject(new Error('Internal error'));
            }
        },
        [fetchWithCredentials],
    );

    const getLocationRecordsByRangeAsync = useCallback(
        async (mobileDeviceId, beginDate, endDate) => {
            const response = await fetchWithCredentials(
                `${ routes.host }${ routes.locationRecord }/byRange/${ mobileDeviceId }?beginDate=${ new Date(
                    beginDate,
                ).toISOString() }&endDate=${ new Date(endDate).toISOString() }`,
                {
                    method: 'GET',
                },
            ).catch((error) => {
                return Promise.reject(error);
            });

            if (response) {
                return response.json().catch((error) => {
                    return Promise.reject(error);
                });
            } else {
                return Promise.reject(new Error('Internal error'));
            }
        },
        [fetchWithCredentials],
    );

    return (
        <AppDataContext.Provider
            value={ {
                getMobileDevices,
                getTimelinesAsync,
                getLocationRecordsAsync,
                getLocationRecordsByRangeAsync,
            } }
            { ...props }
        />
    );
}

const AppDataContext = createContext({});
const useAppData = () => useContext(AppDataContext);

export { AppDataProvider, useAppData };
