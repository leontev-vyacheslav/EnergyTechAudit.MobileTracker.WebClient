import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import notify from 'devextreme/ui/notify';
import { AppSettingsContextModel, AppSettingsDataContextModel } from '../models/app-settings-context';
import { AppBaseProviderProps } from '../models/app-base-provider-props';
import { TimelineModel } from '../models/timeline';

const AppSettingsContext = createContext<AppSettingsContextModel>({} as AppSettingsContextModel);

const useAppSettings = () => useContext(AppSettingsContext);

function AppSettingsProvider (props: AppBaseProviderProps) {

    const coreInitialAppSettingsData: AppSettingsDataContextModel = {
        workDate: new Date(new Date().setHours(0, 0, 0, 0)),

        breakInterval: 1000,
        isShownBreakInterval: true,
        minimalAccuracy: 100,

        stationaryZoneRadius: 100,
        stationaryZoneElementCount: 10,
        stationaryZoneCriteriaSpeed: 2,
        stationaryZoneCriteriaAccuracy: 25,
        useStationaryZoneCriteriaAccuracy: false,
        useStationaryZoneAddressesOnMap: false,
        useStationaryZoneAddressesOnList: false,

        isShowFooter: true,
    };

    const initialAppSettingsDataJson =
        localStorage.getItem('appSettingsData') ||
        JSON.stringify(coreInitialAppSettingsData);

    let initialAppSettingsData = JSON.parse(initialAppSettingsDataJson);

    if(!initialAppSettingsData.breakInterval)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ breakInterval: 1000 } };
    }
    if(!initialAppSettingsData.isShownBreakInterval)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ isShownBreakInterval: true } };
    }
    if(!initialAppSettingsData.minimalAccuracy)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ minimalAccuracy: 100 } };
    }
    if(!initialAppSettingsData.workDate)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ workDate: new Date(new Date().setHours(0, 0, 0, 0)) } };
    }
    else {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ workDate: new Date(initialAppSettingsData.workDate) } };
    }
    if(!initialAppSettingsData.stationaryZoneRadius)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ stationaryZoneRadius: 100 } };
    }
    if(!initialAppSettingsData.stationaryZoneElementCount)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ stationaryZoneElementCount: 10 } };
    }
    if(!initialAppSettingsData.stationaryZoneCriteriaSpeed)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ stationaryZoneCriteriaSpeed: 2 } };
    }
    if(!initialAppSettingsData.stationaryZoneCriteriaAccuracy)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ stationaryZoneCriteriaAccuracy: 25 } };
    }
    if(!initialAppSettingsData.useStationaryZoneCriteriaAccuracy)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ useStationaryZoneCriteriaAccuracy: false } };
    }
    if(!initialAppSettingsData.useStationaryZoneAddressesOnMap)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ useStationaryZoneAddressesOnMap: false } };
    }
    if(!initialAppSettingsData.useStationaryZoneAddressesOnList)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ useStationaryZoneAddressesOnList: false } };
    }
    if(!initialAppSettingsData.isShowFooter)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ isShowFooter: true } };
    }

    const [appSettingsData, setAppSettingsData] = useState<AppSettingsDataContextModel>(initialAppSettingsData);

    useEffect(() => {
        localStorage.setItem('appSettingsData', JSON.stringify(appSettingsData));
    }, [appSettingsData]);

    const getDailyTimelineItem = useCallback( (date) => {
        const beginDate = new Date(date ?? appSettingsData.workDate.valueOf());
        const endDate = new Date(date ?? appSettingsData.workDate.valueOf());
        endDate.setHours(24);

        return {
            id: 0,
            beginDate: beginDate,
            endDate: endDate,
            distance: 0,
            averageSpeed: 0,
            averageAccuracy: 0,
            bestAccuracy: 0,
            worstAccuracy: 0,
            totalAmountLocations: 0,
            valuableAmountLocations: 0,
            takeAccountOutsidePoints: false,
            largestInterval: 0,
            smallestInterval: 0,
            hasGap: false,
            active: false,
            firstLocationRecord: null,
            lastLocationRecord: null
        } as TimelineModel;
    }, [appSettingsData.workDate]);

    const setWorkDateToday = useCallback(() => {
        setAppSettingsData(previous => {
            const workDate = new Date();
            workDate.setHours(0, 0, 0, 0);
            return { ...previous, workDate: workDate };
        });
        notify('Рабочая дата изменена на текущую', 'success', 5000);
    }, []);

    return <AppSettingsContext.Provider value={ {
        appSettingsData,
        setAppSettingsData,
        getDailyTimelineItem,
        setWorkDateToday } } { ...props } />;
}

export { AppSettingsProvider, useAppSettings };
