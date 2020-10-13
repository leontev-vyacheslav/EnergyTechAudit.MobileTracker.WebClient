import React, { createContext, useContext, useEffect, useState } from 'react';

const AppSettingsContext = createContext({});

const useAppSettings = () => useContext(AppSettingsContext);

function AppSettingsProvider (props) {

    const initialAppSettingsDataJson = localStorage.getItem('appSettingsData') || JSON.stringify({
        workDate: new Date().setHours(0, 0, 0, 0),
        duringWorkingDay: true
    });
    const initialAppSettingsData = JSON.parse(initialAppSettingsDataJson);

    const [appSettingsData, setAppSettingsData] = useState(initialAppSettingsData);

    useEffect(() => {
        localStorage.setItem('appSettingsData', JSON.stringify(appSettingsData));
    }, [appSettingsData])

    return (
        <AppSettingsContext.Provider
            value={ { appSettingsData, setAppSettingsData } }
            { ...props }
        />
    );
}

export {
    AppSettingsProvider,
    useAppSettings
}

