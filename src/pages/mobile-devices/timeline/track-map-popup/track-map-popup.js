import React from 'react';

import TrackMap from './track-map/track-map';
import { Popup } from 'devextreme-react/ui/popup';
import { useScreenSize } from '../../../../utils/media-query';

import './track-map-popup.scss';

const TrackMapPopup = ({ mobileDevice, timelineItem, onHiding }) => {
    const { isXSmall } = useScreenSize();
    return (
        <Popup className={ 'track-map-popup' } title={ 'Карта маршрута' } dragEnabled={ false } visible={ true } showTitle={ true }
               onHiding={ onHiding }
               width={ isXSmall ? '90%' : '70%' }
               height={ isXSmall ? '90%' : '70%' }
               contentRender={ () => {
                   return <TrackMap mobileDevice={ mobileDevice } timelineItem={ timelineItem }/>
               } }>
        </Popup>
    );
};
export default TrackMapPopup;
