import React, { useEffect, useState } from 'react';
import { TrackMapIcon } from '../../constants/app-icons';
import PageHeader from '../../components/page-header/page-header';
import { TrackMapSettingsProvider } from '../../components/popups/track-map-popup/track-map-contexts/track-map-settings-context';
import { TrackMapTimelineProvider } from '../../components/popups/track-map-popup/track-map-contexts/track-map-timeline-context';
import { TrackMapTrackProvider } from '../../components/popups/track-map-popup/track-map-contexts/track-map-track-context';
import { TrackMapStationaryZonesProvider } from '../../components/popups/track-map-popup/track-map-contexts/track-map-stationary-zones-context';
import TrackMap from '../../components/popups/track-map-popup/track-map/track-map';
import { TrackMapLocationRecordsProvider } from '../../components/popups/track-map-popup/track-map-contexts/track-map-location-records-context';
import { useLocation } from 'react-router';
import { useAppSettings } from '../../contexts/app-settings';
import { AppDataContextModel, useAppData } from '../../contexts/app-data';
import AppConstants from '../../constants/app-constants';

import './track-map.css';
import { AppSettingsContextModel } from '../../models/app-settings-context';
import { MobileDeviceModel } from '../../models/mobile-device';

export default () => {
    function useQuery () {
        return new URLSearchParams(useLocation().search);
    }

    const query = useQuery();
    const { appSettingsData: { workDate } }: AppSettingsContextModel = useAppSettings();
    const { getMobileDeviceAsync }: AppDataContextModel = useAppData();
    const [mobileDevice, setMobileDevice] = useState<MobileDeviceModel>(null);
    const [mobileDeviceId] = useState<number>(parseInt(query.get('mobileDeviceId') ?? '0'));
    const { setAppSettingsData }: AppSettingsContextModel = useAppSettings();

    useEffect(() => {
        ( async () => {
            if (mobileDeviceId) {
                const mobileDevice = await getMobileDeviceAsync(mobileDeviceId);
                setMobileDevice(mobileDevice);
                setAppSettingsData((previous) => {
                    return { ...previous, isShowFooter: false };
                })
            }
        } )();

        return () => {
            setAppSettingsData((previous) => {
                return { ...previous, isShowFooter: true };
            });
        };
    }, [getMobileDeviceAsync, mobileDeviceId, setAppSettingsData]);

    return (
        <>
            <PageHeader caption={ 'Карта маршрута' }>
                <TrackMapIcon size={ AppConstants.headerIconSize }/>
            </PageHeader>
            <div className={ 'content-block track-map-page' } style={ { height: 'calc(100vh - 150px)' } }>
                { mobileDevice
                    ? <TrackMapTimelineProvider mobileDevice={ mobileDevice } workDate={ workDate }>
                        <TrackMapSettingsProvider>
                            <TrackMapLocationRecordsProvider mobileDevice={ mobileDevice }>
                                <TrackMapTrackProvider>
                                    <TrackMapStationaryZonesProvider>
                                        <TrackMap mobileDevice={ mobileDevice }/>
                                    </TrackMapStationaryZonesProvider>
                                </TrackMapTrackProvider>
                            </TrackMapLocationRecordsProvider>
                        </TrackMapSettingsProvider>
                    </TrackMapTimelineProvider>
                    : null
                }
            </div>
        </>
    );
};
