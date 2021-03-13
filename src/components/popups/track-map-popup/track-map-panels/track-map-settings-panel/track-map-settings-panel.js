import React from 'react';
import TrackMapPanelHeader from '../track-map-panel-header/track-map-panel-header';
import SettingsForm from '../../../../../pages/settings/settings-form';
import { useAppSettings } from '../../../../../contexts/app-settings';
import { SettingsIcon } from '../../../../../constants/app-icons';

const TrackMapSettingsPanel = () => {
    const { setAppSettingsData } = useAppSettings();
    return (
        <div style={ { height: 'calc(100% - 35px)' } }>
            <TrackMapPanelHeader title={ 'Настроки' } icon={ () => <SettingsIcon size={ 20 }/> } onClose={ () => {
                setAppSettingsData(prev => ( { ...prev, isShowTrackMapSettings: false } ))
            } }/>
            <SettingsForm style={ { width: '100%' } } mode={ 'TrackMap' }/>
        </div>
    );
}

export default TrackMapSettingsPanel;
