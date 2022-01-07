import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppBaseProviderProps } from '../../../../models/app-base-provider-props';
import { TrackMapSettingsContextModel } from '../../../../models/track-map-settings-context';

const TrackMapSettingsContext = createContext<TrackMapSettingsContextModel>({} as TrackMapSettingsContextModel);

const useTrackMapSettingsContext = () => useContext(TrackMapSettingsContext);

function TrackMapSettingsProvider (props: AppBaseProviderProps) {

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

    const [isShowTrackMapSettings, setIsShowTrackMapSettings] = useState<boolean>(initialTrackMapSettingsData.isShowTrackMapSettings);
    const [isShowTrackMapZones, setIsShowTrackMapZones] = useState<boolean>(initialTrackMapSettingsData.isShowTrackMapZones);
    const [isShowStationaryZone, setIsShowStationaryZone] = useState<boolean>(initialTrackMapSettingsData.isShowStationaryZone);
    const [isShowTrackMapTimeline, setIsShowTrackMapTimeline] = useState<boolean>(initialTrackMapSettingsData.isShowTrackMapTimeline);

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
