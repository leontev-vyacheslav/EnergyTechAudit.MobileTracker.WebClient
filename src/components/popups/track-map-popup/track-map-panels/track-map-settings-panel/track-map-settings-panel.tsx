import React from 'react';
import TrackMapPanelHeader from '../track-map-panel-header/track-map-panel-header';
import SettingsForm from '../../../../settings-form/settings-form';
import { SettingsIcon } from '../../../../../constants/app-icons';
import { useTrackMapSettingsContext } from '../../track-map-contexts/track-map-settings-context';

const TrackMapSettingsPanel = () => {
    const { setIsShowTrackMapSettings } = useTrackMapSettingsContext();
    return (
        <div style={ { height: 'calc(100% - 35px)' } }>
            <TrackMapPanelHeader title={ 'Настроки' } iconRender={ (props) => <SettingsIcon size={ 22 } { ...props }/> } onClose={ () => {
                setIsShowTrackMapSettings(false);
            } }/>
            <SettingsForm style={ { width: '100%' } } />
        </div>
    );
}

export default TrackMapSettingsPanel;
