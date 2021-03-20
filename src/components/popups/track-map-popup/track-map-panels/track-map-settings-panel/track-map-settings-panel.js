import React from 'react';
import TrackMapPanelHeader from '../track-map-panel-header/track-map-panel-header';
import SettingsForm from '../../../../../pages/settings/settings-form';
import { SettingsIcon } from '../../../../../constants/app-icons';
import { useTrackMapSettingsContext } from '../../track-map-contexts/track-map-settings-context';

const TrackMapSettingsPanel = () => {
    const { setIsShowTrackMapSettings } = useTrackMapSettingsContext();
    return (
        <div style={ { height: 'calc(100% - 35px)' } }>
            <TrackMapPanelHeader title={ 'Настроки' } icon={ () => <SettingsIcon size={ 22 }/> } onClose={ () => {
                setIsShowTrackMapSettings(false);
            } }/>
            <SettingsForm style={ { width: '100%' } } />
        </div>
    );
}

export default TrackMapSettingsPanel;
