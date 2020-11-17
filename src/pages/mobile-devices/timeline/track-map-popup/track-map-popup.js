import React, {  useState } from 'react';
import TrackMap from './track-map/track-map';
import { Popup } from 'devextreme-react/ui/popup';
import { useScreenSize } from '../../../../utils/media-query';
import './track-map-popup.scss';
import { ToolbarItem } from 'devextreme-react/popup';
import { useAppSettings } from '../../../../contexts/app-settings';

const TrackMapPopup = ({ mobileDevice, timelineItem,  onHiding }) => {
    const { isXSmall, isSmall } = useScreenSize();
    const [refreshToken, setRefreshToken] = useState({});
    const { workDatePickerRef } = useAppSettings();

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
                   return <TrackMap mobileDevice={ mobileDevice } timelineItem={ timelineItem } refreshToken={ refreshToken } />
               } }>
            <ToolbarItem widget="dxButton" location="after" options={
                {
                    icon: 'refresh', onClick: () => {
                        setRefreshToken({ ...{} });
                    }
                }
            }/>
            <ToolbarItem widget="dxButton" location="after" options={
                {
                    icon: 'event', onClick: () => {
                        if (workDatePickerRef.current) {
                            workDatePickerRef.current.instance.open();
                        }
                    }
                }
            }/>
        </Popup>
    );
};
export default TrackMapPopup;
