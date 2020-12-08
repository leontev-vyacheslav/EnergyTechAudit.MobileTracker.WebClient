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
        stationaryRadius: 100,
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
    if(!initialAppSettingsData.stationaryRadius)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ stationaryRadius: 100 } };
    }
    if(!initialAppSettingsData.workDate)  {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ workDate: new Date(new Date().setHours(0, 0, 0, 0)) } };
    }
    else {
        initialAppSettingsData = { ...initialAppSettingsData, ...{ workDate: new Date(initialAppSettingsData.workDate) } };
    }

    const [appSettingsData, setAppSettingsData] = useState(initialAppSettingsData);

    useEffect(() => {
        localStorage.setItem('appSettingsData', JSON.stringify(appSettingsData));
    }, [appSettingsData]);

    const getDailyTimelineItem = useCallback( () => {
        const beginDate = new Date(appSettingsData.workDate.valueOf());
        const endDate = new Date(appSettingsData.workDate.valueOf());
        endDate.setHours(24);
        return { id: 0, beginDate: beginDate, endDate: endDate };
    }, [appSettingsData.workDate]);

    return <AppSettingsContext.Provider value={ { appSettingsData, setAppSettingsData, getDailyTimelineItem } } { ...props } />;
}

export { AppSettingsProvider, useAppSettings };
