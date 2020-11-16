import React, {  useState } from 'react';
import TrackMap from './track-map/track-map';
import { Popup } from 'devextreme-react/ui/popup';
import { useScreenSize } from '../../../../utils/media-query';
import './track-map-popup.scss';
import { ToolbarItem } from 'devextreme-react/popup';

const TrackMapPopup = ({ mobileDevice, timelineItem, timeline, onHiding }) => {
    const { isXSmall, isSmall } = useScreenSize();
    const [refreshToken, setRefreshToken] = useState({});
    return (
        <Popup className={ 'track-map-popup' } title={ 'Карта маршрута' }
               dragEnabled={ false }
               visible={ true }
               showTitle={ true }
               showCloseButton={ true }
               onHiding={ onHiding }
               width={ isXSmall || isSmall ? '90%' : '70%' }
               height={ isXSmall || isSmall ? '90%' : '70%' }
               contentRender={ () => {
                   return <TrackMap mobileDevice={ mobileDevice } timelineItem={ timelineItem } timeline={ timeline } refreshToken={ refreshToken } />
               } }>
            <ToolbarItem widget="dxButton" location="after" options={
                {
                    icon: 'refresh', onClick: () => {
                        setRefreshToken({ ...{} });
                    }
                }
            }/>

        </Popup>
    );
};
export default TrackMapPopup;
