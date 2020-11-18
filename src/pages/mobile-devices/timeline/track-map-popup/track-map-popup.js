import React, { useState } from 'react';
import TrackMap from './track-map/track-map';
import { Popup } from 'devextreme-react/ui/popup';
import { ToolbarItem } from 'devextreme-react/popup';
import { useAppSettings } from '../../../../contexts/app-settings';
import { useScreenSize } from '../../../../utils/media-query';
import Menu from 'devextreme-react/menu';

import './track-map-popup.scss';

const TrackMapPopup = ({ mobileDevice, timelineItem, onHiding }) => {
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
               width={ isXSmall || isSmall ? '95%' : '70%' }
               height={ isXSmall || isSmall ? '95%' : '80%' }
               contentRender={ () => {
                   return (
                       <TrackMap
                           mobileDevice={ mobileDevice }
                           timelineItem={ timelineItem }
                           refreshToken={ refreshToken }
                       />
                   );
               } }>
            <ToolbarItem location={ 'after' }>
                <Menu items={ [
                    {
                        icon: 'menu',
                        items: [
                            {
                                text: 'Обновить',
                                icon: 'refresh',
                                onClick: () => {
                                    setRefreshToken({ ...{} });
                                },
                            },
                            {
                                text: 'Рабочая дата',
                                icon: 'event',
                                onClick: () => {
                                    if (workDatePickerRef.current) {
                                        workDatePickerRef.current.instance.open();
                                    }
                                }
                            }
                        ]
                    }
                ] }>
                </Menu>
            </ToolbarItem>
        </Popup>
    );
};
export default TrackMapPopup;
