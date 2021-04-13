import React, { createContext, useCallback, useContext } from 'react';
import routes from '../constants/app-api-routes';
import { useAuth } from './auth';
import { useSharedArea } from './shared-area';
import * as axios from 'axios';
import { HttpConstants } from '../constants/app-http-constants';
import Moment from 'moment';
import { useAppSettings } from './app-settings';
import AppConstants from '../constants/app-constants';
import notify from 'devextreme/ui/notify';

function AppDataProvider (props) {
    const { appSettingsData } = useAppSettings();
    const { getUserAuthDataFromStorageAsync } = useAuth();
    const { showLoader, hideLoader } = useSharedArea();

    const axiosWithCredentials = useCallback(
        async (config) => {
            let response = null;
            const userAuthData = await getUserAuthDataFromStorageAsync();
            if (userAuthData) {
                config = config || {};
                config.headers = config.headers || {};
                config.headers = { ...config.headers, ...HttpConstants.Headers.AcceptJson };
                config.headers.Authorization = `Bearer ${ userAuthData.token }`;
                try {
                    showLoader();
                    response = await axios.request(config);
                } catch (error) {
                    response = error.response;
                    notify('В процессе выполнения запроса или получения данных от сервера произошла ошибка', 'error', 10000);
                } finally {
                    hideLoader();
                }
            }
            return response;
        },
        [getUserAuthDataFromStorageAsync, hideLoader, showLoader],
    );

    const getMobileDevicesAsync = useCallback(async () => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.mobileDevice }`,
            method: HttpConstants.Methods.Get,
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return  response.data;
        }
        return  null;
    }, [axiosWithCredentials]);

    const getMobileDeviceAsync = useCallback(async (mobileDeviceId) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.mobileDevice }/${mobileDeviceId}`,
            method: HttpConstants.Methods.Get
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const getTimelinesAsync = useCallback(async (mobileDeviceId, workDate) => {
            const utcOffset = Moment().utcOffset();

            const response = await axiosWithCredentials({
                    url: `${ routes.host }${ routes.timeline }?mobileDeviceId=${ mobileDeviceId }&workDate=${ Moment(workDate).add(utcOffset, 'm').toDate().toISOString() }`,
                    method: HttpConstants.Methods.Get,
                },
            );
            if (response && response.status === HttpConstants.StatusCodes.Ok) {
                let timeline = response.data;
                timeline = timeline.map(t => {
                    return {
                        ...t, ...{
                            beginDate: Moment(t.beginDate).add(-utcOffset, 'm').toDate(),
                            endDate: Moment(t.endDate).add(-utcOffset, 'm').toDate()
                        }
                    }
                });
                return  timeline;
            }
            return null;
        },
        [axiosWithCredentials],
    );

    const getLocationRecordsByRangeAsync = useCallback(async (mobileDeviceId, beginDate, endDate) => {
            const utcOffset = Moment().utcOffset();
            const response = await axiosWithCredentials({
                    url: `${ routes.host }${ routes.locationRecord }?mobileDeviceId=${ mobileDeviceId }&beginDate=${ Moment(beginDate).add(utcOffset, 'm').toDate().toISOString() }&endDate=${ Moment(endDate).add(utcOffset, 'm').toDate().toISOString() }`,
                    method: HttpConstants.Methods.Get,
                },
            );
            if (response && response.status === HttpConstants.StatusCodes.Ok) {
                let locationRecordsData = response.data;
                if (locationRecordsData) {
                    locationRecordsData = locationRecordsData.filter(l => l.accuracy <= appSettingsData.minimalAccuracy);
                    return locationRecordsData;
                }
            }
            return null;
        },
        [appSettingsData.minimalAccuracy, axiosWithCredentials],
    );

    const getLocationRecordAsync = useCallback(async (locationRecordId) => {
            const response = await axiosWithCredentials({
                    url: `${ routes.host }${ routes.locationRecord }/${ locationRecordId }`,
                    method: HttpConstants.Methods.Get,
                },
            );
            if (response && response.status === HttpConstants.StatusCodes.Ok) {
                return response.data;
            }
            return null;
        },
        [axiosWithCredentials],
    );

    const getGeocodedAddressesAsync = useCallback(async (locationRecord) => {
            const latLng = `${ locationRecord.latitude },${ locationRecord.longitude }`;
            const response = await fetch(
                `${ AppConstants.trackMap.geocodeApiUrl }?latlng=${ encodeURIComponent(latLng) }&key=${ AppConstants.trackMap.apiKey }&language=ru&region=ru`
            );
            if (response && response.status === HttpConstants.StatusCodes.Ok) {
                const dataResponse = await response.json();
                if(dataResponse && dataResponse.status === 'OK') {
                    if(dataResponse.results.length > 0)
                    {
                        return dataResponse.results.map(e => e);
                    }
                }
            }
            return null;
        },
        [],
    );

    const getGeocodedAddressAsync = useCallback(
        async (locationRecord) => {

            const results = await getGeocodedAddressesAsync(locationRecord);
            if(results) {
                return results.find((_, i) => i === i).formatted_address;
            }
            return  null;
        },
        [getGeocodedAddressesAsync]
    );

    const getGeocodedSelectedAddressesAsync = useCallback(async (locationRecordInfo) => {
        let selectedAddress = [];
        const addresses = await getGeocodedAddressesAsync(locationRecordInfo);
        if (addresses) {
            selectedAddress = addresses
                .filter(a => a.types.includes('street_address') || a.types.includes('premise'))
                .map(a => a.formatted_address)
                .filter((val, indx, arr) => arr.indexOf(val) === indx);
        }
        if (selectedAddress.length === 0) {
            selectedAddress.push(addresses.find((_, i) => i === i).formatted_address)
        }
        return selectedAddress;
    }, [getGeocodedAddressesAsync]);

    const getGeocodedLocationAsync = useCallback(async (address) => {
            const response = await fetch(
                `${ AppConstants.trackMap.geocodeApiUrl }?address=${ encodeURIComponent(address) }&key=${ AppConstants.trackMap.apiKey }&language=ru&region=ru`
            );
            if (response && response.status === HttpConstants.StatusCodes.Ok) {
                const dataResponse = await response.json();
                if(dataResponse && dataResponse.status === 'OK') {
                    if(dataResponse.results.length > 0)
                    {
                        return dataResponse.results.find((e, i) => i === 0);
                    }
                }
            }
            return null;
        },
        [],
    );

    const getTrackSheetAsync = useCallback(async (mobileDeviceId, currentData) => {
            const utcOffset = Moment().utcOffset();
            const response = await axiosWithCredentials({
                    url: `${ routes.host }${ routes.timeline }/track-sheet?mobileDeviceId=${ mobileDeviceId }&currentDate=${Moment(currentData).add(utcOffset, 'm').toDate().toISOString()}`,
                    method: HttpConstants.Methods.Get,
                },
            );
            if (response && response.status === HttpConstants.StatusCodes.Ok) {
                return response.data;
            }
            return null;
        },
        [axiosWithCredentials],
    );

    const getExtendedUserInfoAsync = useCallback(async (userId) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.userManagement }/${ userId }`,
            method: HttpConstants.Methods.Get
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const postExtendedUserInfoAsync = useCallback(async (extendedUserInfo) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.userManagement }`,
            method: HttpConstants.Methods.Post,
            data: extendedUserInfo
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const getOrganizationOfficesAsync = useCallback(async (organizationId) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.organization }/organization-offices` + (organizationId ? `/${organizationId}` :  ''),
            method: HttpConstants.Methods.Get
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const getOrganizationsAsync = useCallback(async () => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.organization }/organizations`,
            method: HttpConstants.Methods.Get
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const deleteOrganizationAsync = useCallback(async (organizationId) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.organization }/${ organizationId }`,
            method: HttpConstants.Methods.Delete
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const deleteOfficeAsync = useCallback(async (officeId) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.organization }/offices/${ officeId }`,
            method: HttpConstants.Methods.Delete
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const postOrganizationAsync = useCallback(async (organization) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.organization }`,
            method: HttpConstants.Methods.Post,
            data: organization
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const getOfficeAsync = useCallback(async (officeId) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.organization }/offices/${ officeId }`,
            method: HttpConstants.Methods.Get
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const postOfficeAsync = useCallback(async (office) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.organization }/offices`,
            method: HttpConstants.Methods.Post,
            data: office
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const deleteScheduleItemAsync = useCallback(async (scheduleItemId) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.organization }/schedule-items/${ scheduleItemId }`,
            method: HttpConstants.Methods.Delete
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    return (
        <AppDataContext.Provider
            value={ {
                getMobileDeviceAsync, getMobileDevicesAsync,  getTimelinesAsync, getLocationRecordsByRangeAsync,
                getLocationRecordAsync,  getGeocodedAddressAsync, getGeocodedAddressesAsync, getGeocodedSelectedAddressesAsync, getGeocodedLocationAsync, getTrackSheetAsync,
                postExtendedUserInfoAsync, getExtendedUserInfoAsync,

                getOrganizationsAsync, getOrganizationOfficesAsync, deleteOrganizationAsync, deleteOfficeAsync,
                postOrganizationAsync, getOfficeAsync, postOfficeAsync, deleteScheduleItemAsync
            } }
            { ...props }
        />
    );
}

const AppDataContext = createContext({});
const useAppData = () => useContext(AppDataContext);

export { AppDataProvider, useAppData };
