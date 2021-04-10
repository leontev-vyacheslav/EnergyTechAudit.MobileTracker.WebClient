import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AppSettingsContext = createContext({});

const useAppSettings = () => useContext(AppSettingsContext);

function AppSettingsProvider (props) {

    const coreInitialAppSettingsData = {
        workDate: new Date(new Date().setHours(0, 0, 0, 0)),
        duringWorkingDay: true,

        breakInterval: 1000,
        isShownBreakInterval: true,
        minimalAccuracy: 100,

        stationaryZoneRadius: 100,
        stationaryZoneElementCount: 10,
        stationaryZoneCriteriaSpeed: 2,
        stationaryZoneCriteriaAccuracy: 25,
        useStationaryZoneCriteriaAccuracy: false,
        useStationaryZoneAddresses: false,
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
    if(!initialAppSettingsData.useStationaryZoneAddresses)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ useStationaryZoneAddresses: false } };
    }

    const [appSettingsData, setAppSettingsData] = useState(initialAppSettingsData);

    useEffect(() => {
        localStorage.setItem('appSettingsData', JSON.stringify(appSettingsData));
    }, [appSettingsData]);

    const getDailyTimelineItem = useCallback( (date) => {
        const beginDate = new Date(date ?? appSettingsData.workDate.valueOf());
        const endDate = new Date(date ?? appSettingsData.workDate.valueOf());
        endDate.setHours(24);
        return { id: 0, beginDate: beginDate, endDate: endDate };
    }, [appSettingsData.workDate]);

    const setWorkDateToday = useCallback(() => {
        setAppSettingsData(previous => {
            const workDate = new Date();
            workDate.setHours(0, 0, 0, 0);
            return { ...previous, workDate: workDate };
        });
    }, []);

    return <AppSettingsContext.Provider value={ {
        appSettingsData, setAppSettingsData,
        getDailyTimelineItem, setWorkDateToday } } { ...props } />;
}

export { AppSettingsProvider, useAppSettings };
