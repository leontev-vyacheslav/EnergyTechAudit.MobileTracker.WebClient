import React, { createContext, useCallback, useContext } from 'react';
import routes from '../constants/app-api-routes';
import { useAuth } from './auth';
import { useSharedArea } from './shared-area';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { HttpConstants } from '../constants/app-http-constants';
import Moment from 'moment';
import { useAppSettings } from './app-settings';
import AppConstants from '../constants/app-constants';
import notify from 'devextreme/ui/notify';
import { SharedAreaContextModel } from '../models/shared-area-context';
import { AppBaseProviderProps } from '../models/app-base-provider-props';
import { TimelineModel } from '../models/timeline';
import { TrackLocationRecordModel } from '../models/track-location-record';
import { MobileDeviceModel } from '../models/mobile-device';
import { OrganizationPopupModel } from '../models/organization-popup';
import { LocationRecordDataModel } from '../models/location-record-data';

export type AxiosWithCredentialsFunc = (config: AxiosRequestConfig) => Promise<AxiosResponse<any, any> | undefined>;
export type GetMobileDevicesAsyncFunc = () => Promise<MobileDeviceModel[] | null>;
export type GetMobileDeviceAsyncFunc = (mobileDeviceId: number) => Promise<MobileDeviceModel | null>;
export type GetAssignOrganizationAsyncFunc = (userVerificationData: any) => Promise<any>;
export type GetMobileDeviceBackgroundStatusListAsyncFunc = (mobileDeviceId: number, beginDate: Date, endDate: Date) => Promise<any>;
export type GetTimelinesAsyncFunc = (mobileDeviceId: number, workDate: Date) => Promise<TimelineModel[]>;
export type GetLocationRecordsByRangeAsyncFunc = (mobileDeviceId: number, beginDate: Date, endDate: Date) => Promise<TrackLocationRecordModel[] | null>;
export type GetLocationRecordAsyncFunc = (locationRecordId: number) => Promise<LocationRecordDataModel | null>;
export type GetGeocodedAddressesAsyncFunc = (locationRecord: LocationRecordDataModel) => Promise<any[]>;
export type GetGeocodedAddressAsyncFunc = (locationRecord: any) => Promise<any>;
export type GetGeocodedLocationAsyncFunc = (address: string) => Promise<any>;
export type GetOrganizationOfficesAsyncFunc = (organizationId?: number) => Promise<OrganizationPopupModel[] | null>

export type AppDataContextModel = {
  getAssignOrganizationAsync: GetAssignOrganizationAsyncFunc,
  getMobileDeviceAsync: GetMobileDeviceAsyncFunc,
  getMobileDevicesAsync: GetMobileDevicesAsyncFunc,
  getMobileDeviceBackgroundStatusListAsync: GetMobileDeviceBackgroundStatusListAsyncFunc,
  getTimelinesAsync: GetTimelinesAsyncFunc,
  getLocationRecordsByRangeAsync: GetLocationRecordsByRangeAsyncFunc,
  getLocationRecordAsync: GetLocationRecordAsyncFunc,
  getGeocodedAddressAsync: GetGeocodedAddressAsyncFunc,
  getGeocodedAddressesAsync: GetGeocodedAddressAsyncFunc,
  getGeocodedSelectedAddressesAsync: GetGeocodedAddressesAsyncFunc,
  getGeocodedLocationAsync: GetGeocodedLocationAsyncFunc,
  getTrackSheetAsync: any,
  getExtendedUserInfoAsync: any,
  postExtendedUserInfoAsync: any,
  getOrganizationsAsync: any,
  getOrganizationOfficesAsync: GetOrganizationOfficesAsyncFunc,
  deleteOrganizationAsync: any,
  postOrganizationAsync: any,
  getOfficeAsync: any,
  postOfficeAsync: any,
  deleteOfficeAsync: any,
  deleteScheduleItemAsync: any,
  getAdminListAsync: any,
  getAdminAsync: any,
  postAdminAsync: any,
  deleteAdminAsync: any
};

const AppDataContext = createContext<AppDataContextModel>({} as AppDataContextModel);
const useAppData = () => useContext(AppDataContext);

function AppDataProvider (props: AppBaseProviderProps) {
    const { appSettingsData } = useAppSettings();
    const { getUserAuthDataFromStorage } = useAuth();
    const { showLoader, hideLoader }: SharedAreaContextModel = useSharedArea();

    const axiosWithCredentials = useCallback<AxiosWithCredentialsFunc>(
        async (config) => {
            let response = null;
            const userAuthData = getUserAuthDataFromStorage();
            config = config || {};
            config.headers = config.headers || {};
            config.headers = { ...config.headers, ...HttpConstants.Headers.AcceptJson };

            if (userAuthData) {
               config.headers.Authorization = `Bearer ${ userAuthData.token }`;
            }

            try {
                showLoader();
                response = await axios.request(config) as AxiosResponse<any, any>;
            } catch (error) {
                response = (error as AxiosError).response;
                notify('В процессе выполнения запроса или получения данных от сервера произошла ошибка', 'error', 10000);
            } finally {
                hideLoader();
            }

            return response;
        },
        [getUserAuthDataFromStorage, hideLoader, showLoader],
    );

    const getAssignOrganizationAsync = useCallback<GetAssignOrganizationAsyncFunc>(async (userVerificationData) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.accountAssignOrganization }`,
            method: HttpConstants.Methods.Post as Method,
            data: userVerificationData
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const getMobileDevicesAsync = useCallback<GetMobileDevicesAsyncFunc>(async () => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.mobileDevice }`,
            method: HttpConstants.Methods.Get as Method,
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return  response.data as MobileDeviceModel[];
        }
        return  null;
    }, [axiosWithCredentials]);

    const getMobileDeviceAsync = useCallback<GetMobileDeviceAsyncFunc>(async (mobileDeviceId) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.mobileDevice }/${mobileDeviceId}`,
            method: HttpConstants.Methods.Get as Method
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data as MobileDeviceModel;
        }
        return null;
    }, [axiosWithCredentials]);

    const getMobileDeviceBackgroundStatusListAsync = useCallback<GetMobileDeviceBackgroundStatusListAsyncFunc>( async (mobileDeviceId, beginDate, endDate) => {
        const utcOffset = Moment().utcOffset();
        const response = await axiosWithCredentials({
                url: `${ routes.host }${ routes.mobileDevice }/background-status/${mobileDeviceId}?beginDate=${ Moment(beginDate).add(utcOffset, 'm').toDate().toISOString() }&endDate=${ Moment(endDate).add(utcOffset, 'm').toDate().toISOString() }`,
                method: HttpConstants.Methods.Get as Method,
            },
        );
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            const rwaBackgroundStatuses = response.data;
            let backgroundStatuses = null;
            if (rwaBackgroundStatuses) {
                backgroundStatuses = rwaBackgroundStatuses.map((r: any) => {
                    return {
                        id: r.id,
                        mobileDeviceId: r.mobileDeviceId,
                        mobileDeviceDateTime: r.mobileDeviceDateTime,
                        serverDateTime: r.serverDateTime,
                        statusInfo: JSON.parse(r.statusInfo)
                    }
                });
            }
            return backgroundStatuses;
        }
    }, [axiosWithCredentials]);

    const getTimelinesAsync = useCallback<GetTimelinesAsyncFunc>(async (mobileDeviceId, workDate) => {
            const utcOffset = Moment().utcOffset();

            const response = await axiosWithCredentials({
                    url: `${ routes.host }${ routes.timeline }?mobileDeviceId=${ mobileDeviceId }&workDate=${ Moment(workDate).add(utcOffset, 'm').toDate().toISOString() }`,
                    method: HttpConstants.Methods.Get as Method,
                } as AxiosRequestConfig,
            );
            if (response && response.status === HttpConstants.StatusCodes.Ok) {
                let timeline = response.data;
                timeline = timeline.map((t: any) => {
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
        [axiosWithCredentials]);

    const getLocationRecordsByRangeAsync = useCallback<GetLocationRecordsByRangeAsyncFunc>(async (mobileDeviceId, beginDate, endDate) => {
            const utcOffset = Moment().utcOffset();
            const response = await axiosWithCredentials({
                    url: `${ routes.host }${ routes.locationRecord }?mobileDeviceId=${ mobileDeviceId }&beginDate=${ Moment(beginDate).add(utcOffset, 'm').toDate().toISOString() }&endDate=${ Moment(endDate).add(utcOffset, 'm').toDate().toISOString() }`,
                    method: HttpConstants.Methods.Get as Method,
                },
            );

            if (response && response.status === HttpConstants.StatusCodes.Ok) {
                let locationRecordsData = response.data as TrackLocationRecordModel[];
                if (locationRecordsData) {
                    locationRecordsData = locationRecordsData.filter(l => l.accuracy <= appSettingsData.minimalAccuracy);

                    return locationRecordsData;
                }
            }

            return null;
        },
        [appSettingsData.minimalAccuracy, axiosWithCredentials]);

    const getLocationRecordAsync = useCallback<GetLocationRecordAsyncFunc>(async (locationRecordId) => {

            const response = await axiosWithCredentials({
                    url: `${ routes.host }${ routes.locationRecord }/${ locationRecordId }`,
                    method: HttpConstants.Methods.Get as Method,
                },
            );
            if (response && response.status === HttpConstants.StatusCodes.Ok) {
                return response.data as LocationRecordDataModel;
            }

            return null;
        },
        [axiosWithCredentials]);

    const getGeocodedAddressesAsync = useCallback<GetGeocodedAddressesAsyncFunc>(async (locationRecord) => {
            const latLng = `${ locationRecord.latitude },${ locationRecord.longitude }`;
            const response = await fetch(
                `${ AppConstants.trackMap.geocodeApiUrl }?latlng=${ encodeURIComponent(latLng) }&key=${ AppConstants.trackMap.apiKey }&language=ru&region=ru`
            );
            if (response && response.status === HttpConstants.StatusCodes.Ok) {
                const dataResponse = await response.json();
                if(dataResponse && dataResponse.status === 'OK') {
                    if(dataResponse.results.length > 0)
                    {
                        return dataResponse.results.map((e: any) => e);
                    }
                }
            }
            return null;
        },
        []);

    const getGeocodedAddressAsync = useCallback<GetGeocodedAddressAsyncFunc>(async (locationRecord) => {
            const results = await getGeocodedAddressesAsync(locationRecord);
            if(results) {
                return results.find(() => true)?.formatted_address;
            }

            return  null;
        },
        [getGeocodedAddressesAsync]);

    const getGeocodedSelectedAddressesAsync = useCallback<GetGeocodedAddressesAsyncFunc>(async (locationRecord) => {
        let selectedAddress = [];
        const addresses = await getGeocodedAddressesAsync(locationRecord);
        if (addresses) {
            selectedAddress = addresses
                .filter((a: any) => a.types.includes('street_address') || a.types.includes('premise'))
                .map((a: any) => a.formatted_address)
                .filter((val: any, indx: number, arr: any[]) => arr.indexOf(val) === indx);
        }
        if (selectedAddress.length === 0) {
            selectedAddress.push(addresses.find((_: any, i: any) => i === i).formatted_address)
        }
        return selectedAddress;
    }, [getGeocodedAddressesAsync]);

    const getGeocodedLocationAsync = useCallback<GetGeocodedLocationAsyncFunc>(async (address) => {
            const response = await fetch(
                `${ AppConstants.trackMap.geocodeApiUrl }?address=${ encodeURIComponent(address) }&key=${ AppConstants.trackMap.apiKey }&language=ru&region=ru`
            );
            if (response && response.status === HttpConstants.StatusCodes.Ok) {
                const dataResponse = await response.json();
                if(dataResponse && dataResponse.status === 'OK') {
                    if(dataResponse.results.length > 0)
                    {
                        return dataResponse.results.find(() => true);
                    }
                }
            }
            return null;
        },
        []);

    const getTrackSheetAsync = useCallback(async (mobileDeviceId, currentData) => {
            const utcOffset = Moment().utcOffset();
            const response = await axiosWithCredentials({
                    url: `${ routes.host }${ routes.timeline }/track-sheet?mobileDeviceId=${ mobileDeviceId }&currentDate=${Moment(currentData).add(utcOffset, 'm').toDate().toISOString()}`,
                    method: HttpConstants.Methods.Get as Method,
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
            method: HttpConstants.Methods.Get as Method,
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const postExtendedUserInfoAsync = useCallback(async (extendedUserInfo) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.userManagement }`,
            method: HttpConstants.Methods.Post as Method,
            data: extendedUserInfo
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const getOrganizationOfficesAsync = useCallback<GetOrganizationOfficesAsyncFunc>(async (organizationId) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.organization }/organization-offices` + (organizationId ? `/${organizationId}` :  ''),
            method: HttpConstants.Methods.Get as Method,
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }

        return null;
    }, [axiosWithCredentials]);

    const getOrganizationsAsync = useCallback(async () => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.organization }`,
            method: HttpConstants.Methods.Get as Method
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const deleteOrganizationAsync = useCallback(async (organizationId) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.organization }/${ organizationId }`,
            method: HttpConstants.Methods.Delete as Method,
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const deleteOfficeAsync = useCallback(async (officeId) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.organization }/offices/${ officeId }`,
            method: HttpConstants.Methods.Delete as Method
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const postOrganizationAsync = useCallback(async (organization) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.organization }`,
            method: HttpConstants.Methods.Post as Method,
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
            method: HttpConstants.Methods.Get as Method
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const postOfficeAsync = useCallback(async (office) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.organization }/offices`,
            method: HttpConstants.Methods.Post as Method,
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
            method: HttpConstants.Methods.Delete as Method
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const getAdminListAsync = useCallback( async () => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.administrator }/administrators`,
            method: HttpConstants.Methods.Get as Method
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const getAdminAsync = useCallback(async (id) =>{
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.administrator }/${id}`,
            method: HttpConstants.Methods.Get as Method,
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials] );

    const postAdminAsync = useCallback(async (admin) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.administrator }`,
            method: HttpConstants.Methods.Post as Method,
            data: admin
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    const deleteAdminAsync = useCallback(async (id) => {
        const response = await axiosWithCredentials({
            url: `${ routes.host }${ routes.administrator }/${ id }`,
            method: HttpConstants.Methods.Delete as Method
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return response.data;
        }
        return null;
    }, [axiosWithCredentials]);

    return (
        <AppDataContext.Provider
            value={ {
                getAssignOrganizationAsync,
                getMobileDeviceAsync, getMobileDevicesAsync, getMobileDeviceBackgroundStatusListAsync,
                getTimelinesAsync,
                getLocationRecordsByRangeAsync, getLocationRecordAsync,
                getGeocodedAddressAsync, getGeocodedAddressesAsync, getGeocodedSelectedAddressesAsync, getGeocodedLocationAsync,
                getTrackSheetAsync,
                getExtendedUserInfoAsync, postExtendedUserInfoAsync,
                getOrganizationsAsync, getOrganizationOfficesAsync, deleteOrganizationAsync,  postOrganizationAsync,
                getOfficeAsync, postOfficeAsync, deleteOfficeAsync, deleteScheduleItemAsync,
                getAdminListAsync, getAdminAsync, postAdminAsync, deleteAdminAsync
            } }
            { ...props }
        />
    );
}

export { AppDataProvider, useAppData };
