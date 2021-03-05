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
        isShowStationaryZone: false,

        stationaryZoneBias: 1.25,
        stationaryZoneMinRadius: 100,
        stationaryZoneMinElementCount: 5,
        stationaryZoneMinCriteriaSpeed: 3
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
    if(!initialAppSettingsData.isShowStationaryZone)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ isShowStationaryZone: false } };
    }

    if(!initialAppSettingsData.stationaryZoneBias)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ stationaryZoneBias: 1.25 } };
    }
    if(!initialAppSettingsData.stationaryZoneMinRadius)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ stationaryZoneMinRadius: 100 } };
    }
    if(!initialAppSettingsData.stationaryZoneMinElementCount)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ stationaryZoneMinElementCount: 10 } };
    }
    if(!initialAppSettingsData.stationaryZoneMinCriteriaSpeed)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ stationaryZoneMinCriteriaSpeed: 2 } };
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

    return <AppSettingsContext.Provider value={ { appSettingsData, setAppSettingsData, getDailyTimelineItem } } { ...props } />;
}

export { AppSettingsProvider, useAppSettings };
