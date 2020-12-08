import React, { createContext, useCallback, useContext } from 'react';
import routes from '../constants/routes';
import { useAuth } from './auth';
import { useSharedArea } from './shared-area';
import * as axios from 'axios';
import { HttpConstants } from '../constants/http-constants';
import { DateEx } from '../utils/DateEx';
import Moment from 'moment';

function AppDataProvider (props) {
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
        return await axiosWithCredentials({
            url: `${ routes.host }${ routes.mobileDevices }`,
            method: 'GET',
        })
    }, [axiosWithCredentials]);

    const getTimelinesAsync = useCallback(
        async (mobileDeviceId, workDate) => {
            const response = await axiosWithCredentials({
                    url: `${ routes.host }${ routes.timeline }?mobileDeviceId=${ mobileDeviceId }&workDate=${ new DateEx(workDate).toLocalISOString() }`,
                    method: 'GET',
                },
            );
            if (response && response.status === HttpConstants.StatusCodes.Ok) {
                let timeline = response.data;
                const utcOffset = Moment().utcOffset();
                timeline = timeline.map(t => {
                    return {
                        ...t, ...{
                            beginDate: Moment(t.beginDate).add(-utcOffset, 'm').toDate(),
                            endDate: Moment(t.endDate).add(-utcOffset, 'm').toDate()
                        }
                    }
                });
                response.data = timeline;
            }
            return response;
        },
        [axiosWithCredentials],
    );

    const getLocationRecordsByRangeAsync = useCallback(
        async (mobileDeviceId, beginDate, endDate) => {
            return await axiosWithCredentials({
                    url: `${ routes.host }${ routes.locationRecord }/byRange/${ mobileDeviceId }?beginDate=${ new DateEx(beginDate).toLocalISOString() }&endDate=${ new DateEx(endDate).toLocalISOString() }`,
                    method: 'GET',
                },
            );
        },
        [axiosWithCredentials],
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
