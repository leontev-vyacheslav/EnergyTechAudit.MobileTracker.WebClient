import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import TrackMapInfoBox from '../track-map-components/track-map-info-box/track-map-info-box';
import TrackMapHeader from '../track-map-components/track-map-header/track-map-header';
import AppConstants from '../../../../constants/app-constants';
import TrackMapStationaryZonesPanel from '../track-map-panels/track-map-stationary-zones-panel/track-map-stationary-zones-panel';
import TrackMapSettingsForm from '../track-map-panels/track-map-settings-panel/track-map-settings-panel';
import TrackMapTimelinePanel from '../track-map-panels/track-map-timeline-panel/track-map-timeline-panel';
import { useTrackMapSettingsContext } from '../track-map-contexts/track-map-settings-context';
import { useScreenSize } from '../../../../utils/media-query';
import { useTrackMapTrackContext } from '../track-map-contexts/track-map-track-context';

import './track-map.scss';
import { MobileDeviceModel } from '../../../../pages/mobile-devices/mobile-devices';
import { TrackMapSettingsContextModel } from '../../../../models/track-map-settings-context';

const TrackMap = ({ mobileDevice }: { mobileDevice: MobileDeviceModel }) => {
    const { isXSmall, isSmall } = useScreenSize();
    const { isShowTrackMapSettings, isShowTrackMapZones, isShowTrackMapTimeline }: TrackMapSettingsContextModel = useTrackMapSettingsContext();
    const { setCurrentMapInstance, fitMapBoundsByLocations, closeInfoWindow }: any = useTrackMapTrackContext();

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: AppConstants.trackMap.apiKey,
        libraries: AppConstants.trackMap.libraries as any
    });

    const onTrackMapLoadHandler = useCallback((googleMap: google.maps.Map) => {
        setCurrentMapInstance(googleMap);
    }, [setCurrentMapInstance]);

    return ( isLoaded ?
            <div className={ 'track-map-container' }>
                <div className={ 'track-map-container-header' }>
                    <TrackMapHeader mobileDevice={ mobileDevice }/>
                </div>
                <div
                    className={ `track-map-container-body${ !isXSmall && ( isShowTrackMapSettings || isShowTrackMapZones || isShowTrackMapTimeline ) ? ' track-map-container-body-split' : '' }` }>
                    <GoogleMap
                        zoom={ AppConstants.trackMap.defaultZoom }
                        mapTypeId={ window.google.maps.MapTypeId.ROADMAP }
                        options={
                            {
                                mapTypeControl: !( isXSmall || isSmall ),
                                scaleControl: !isXSmall,
                                zoomControl: !( isXSmall || isSmall ),
                                styles: AppConstants.trackMap.defaultTheme
                            } }
                        center={ AppConstants.trackMap.defaultCenter }
                        mapContainerStyle={ { width: '100%', height: '100%' } }
                        onLoad={ onTrackMapLoadHandler }
                        onClick={ () => {
                            closeInfoWindow();
                        } }
                        onRightClick={ () => {
                            fitMapBoundsByLocations();
                        } }
                    >
                        { isXSmall ? null :
                            <TrackMapInfoBox mobileDevice={ mobileDevice }/>
                        }
                    </GoogleMap>
                </div>
                { !isXSmall && isShowTrackMapZones && !isShowTrackMapSettings && !isShowTrackMapTimeline ?
                    <div className={ 'dx-card responsive-paddings' }>
                        <TrackMapStationaryZonesPanel/>
                    </div>
                    : null
                }
                { !isXSmall && isShowTrackMapSettings && !isShowTrackMapZones && !isShowTrackMapTimeline ?
                    <div className={ 'dx-card responsive-paddings' }>
                        <TrackMapSettingsForm/>
                    </div>
                    : null
                }
                { !isXSmall && isShowTrackMapTimeline && !isShowTrackMapZones && !isShowTrackMapSettings ?
                    <div className={ 'dx-card responsive-paddings' }>
                        <TrackMapTimelinePanel/>
                    </div>
                    : null
                }
            </div>
            :
            <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
    );
};

TrackMap.propTypes = {
    mobileDevice: PropTypes.object.isRequired
}

export default TrackMap;
