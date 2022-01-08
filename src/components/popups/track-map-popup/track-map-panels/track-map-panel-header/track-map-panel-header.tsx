import React from 'react';
import Button from 'devextreme-react/ui/button';
import { CloseIcon } from '../../../../../constants/app-icons';

import './track-map-panel-header.scss'
import { TrackMapPanelHeaderProps } from '../../../../../models/track-map-panel-header-props';

const TrackMapPanelHeader = ({ title, icon, onClose }: TrackMapPanelHeaderProps) => {
    return (
        <div className={ 'track-map-panel-header dx-popup-title' } >
            <div style={ { marginTop: 5 } }>
                { icon() }
            </div>
            <div>
                <span>{title}</span>
            </div>
            <div>
                <Button className={ 'app-command-button app-command-button-small' } onClick={ onClose }>
                    <CloseIcon size={ 22 }/>
                </Button>
            </div>
        </div>
    );
}

export default TrackMapPanelHeader;
