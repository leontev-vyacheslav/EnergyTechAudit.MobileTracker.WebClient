import React, { createContext, useContext, useEffect, useState } from 'react';

const TrackMapSettingsContext = createContext({});

const useTrackMapSettingsContext = () => useContext(TrackMapSettingsContext);

function TrackMapSettingsProvider (props) {

    const coreInitialTrackMapSettingsData = {
        isShowStationaryZone: false,
        isShowTrackMapSettings: false,
        isShowTrackMapZones: false,
        isShowTrackMapTimeline: false,
    };

    const initialTrackMapSettingsDataJson =
        localStorage.getItem('trackMapSettingsData') ||
        JSON.stringify(coreInitialTrackMapSettingsData);

    let initialTrackMapSettingsData = JSON.parse(initialTrackMapSettingsDataJson);

    if(!initialTrackMapSettingsData.isShowStationaryZone)  {
        initialTrackMapSettingsData = { ...initialTrackMapSettingsData, ...{ isShowStationaryZone: false } };
    }
    if(!initialTrackMapSettingsData.isShowTrackMapZones)  {
        initialTrackMapSettingsData = { ...initialTrackMapSettingsData, ...{ isShowTrackMapZones: false } };
    }
    if(!initialTrackMapSettingsData.isShowTrackMapSettings)  {
        initialTrackMapSettingsData = { ...initialTrackMapSettingsData, ...{ isShowTrackMapSettings: false } };
    }
    if(!initialTrackMapSettingsData.isShowTrackMapTimeline)  {
        initialTrackMapSettingsData = { ...initialTrackMapSettingsData, ...{ isShowTrackMapTimeline: false } };
    }

    const [isShowTrackMapSettings, setIsShowTrackMapSettings] = useState(initialTrackMapSettingsData.isShowTrackMapSettings);
    const [isShowTrackMapZones, setIsShowTrackMapZones] = useState(initialTrackMapSettingsData.isShowTrackMapZones);
    const [isShowStationaryZone, setIsShowStationaryZone] = useState(initialTrackMapSettingsData.isShowStationaryZone);
    const [isShowTrackMapTimeline, setIsShowTrackMapTimeline] = useState(initialTrackMapSettingsData.isShowTrackMapTimeline);

    useEffect(() => {
        localStorage.setItem('trackMapSettingsData', JSON.stringify({
            isShowTrackMapSettings: isShowTrackMapSettings,
            isShowTrackMapZones: isShowTrackMapZones,
            isShowStationaryZone: isShowStationaryZone,
            isShowTrackMapTimeline: isShowTrackMapTimeline
        }));
    }, [isShowStationaryZone, isShowTrackMapSettings, isShowTrackMapTimeline, isShowTrackMapZones]);

    return (
        <TrackMapSettingsContext.Provider value={ {
            isShowTrackMapSettings, setIsShowTrackMapSettings,
            isShowTrackMapZones, setIsShowTrackMapZones,
            isShowStationaryZone, setIsShowStationaryZone,
            isShowTrackMapTimeline, setIsShowTrackMapTimeline
        } } { ...props }/>

    );
}

export { TrackMapSettingsProvider, useTrackMapSettingsContext }
