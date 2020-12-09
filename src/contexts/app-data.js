import React, { createContext, useCallback, useContext } from 'react';
import routes from '../constants/routes';
import { useAuth } from './auth';
import { useSharedArea } from './shared-area';
import * as axios from 'axios';
import { HttpConstants } from '../constants/http-constants';
import { DateEx } from '../utils/DateEx';
import Moment from 'moment';
import { useAppSettings } from './app-settings';

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
                    console.log(error);
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
            url: `${ routes.host }${ routes.mobileDevices }`,
            method: HttpConstants.Methods.Get,
        });
        if (response && response.status === HttpConstants.StatusCodes.Ok) {
            return  response.data;
        }
        return  null;
    }, [axiosWithCredentials]);

    const getTimelinesAsync = useCallback(
        async (mobileDeviceId, workDate) => {
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

    const getLocationRecordsByRangeAsync = useCallback(
        async (mobileDeviceId, beginDate, endDate) => {

            const response = await axiosWithCredentials({
                    url: `${ routes.host }${ routes.locationRecord }/byRange/${ mobileDeviceId }?beginDate=${ new DateEx(beginDate).toLocalISOString() }&endDate=${ new DateEx(endDate).toLocalISOString() }`,
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

    return (
        <AppDataContext.Provider
            value={ { getMobileDevicesAsync, getTimelinesAsync, getLocationRecordsByRangeAsync, } }
            { ...props }
        />
    );
}

const AppDataContext = createContext({});
const useAppData = () => useContext(AppDataContext);

export { AppDataProvider, useAppData };
