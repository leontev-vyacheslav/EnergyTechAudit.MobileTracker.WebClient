import React, { useState, useRef } from 'react';
import TrackMap from './track-map/track-map';
import { Popup } from 'devextreme-react/popup';
import { ToolbarItem } from 'devextreme-react/popup';
import { useScreenSize } from '../../../../utils/media-query';
import { useSharedArea } from '../../../../contexts/shared-area';
import { Button } from 'devextreme-react/button';
import TrackMapPopupMenu from './track-map-popup-menu/track-map-popup-menu'
import { AdditionalMenuIcon } from '../../../../constants/app-icons';

const TrackMapPopup = ({ mobileDevice, timelineItem, initialDate, onClose }) => {
    const { isXSmall, isSmall } = useScreenSize();
    const [refreshToken, setRefreshToken] = useState({});
    const { showWorkDatePicker } = useSharedArea();
    const contextMenuRef = useRef();
    return (
        <Popup className={ 'app-popup track-map-popup' } title={ 'Карта маршрута' }
               dragEnabled={ false }
               visible={ true }
               showTitle={ true }
               showCloseButton={ true }
               onHiding={ onClose }
               width={ isXSmall || isSmall ? '95%' : '70%' }
               height={ isXSmall || isSmall ? '95%' : '80%' }
               contentRender={ () => {
                   return (
                       <TrackMap
                           mobileDevice={ mobileDevice }
                           timelineItem={ timelineItem }
                           initialDate={ initialDate }
                           refreshToken={ refreshToken }
                       />
                   );
               } }>
            <ToolbarItem location={ 'after' }>
                <Button className={ 'app-popup-header-menu-button' } onClick={ (e) => {
                    contextMenuRef.current.instance.option('target', e.element);
                    contextMenuRef.current.instance.show();
                } } >
                    <AdditionalMenuIcon size={ 18 }/>
                    <TrackMapPopupMenu
                        ref={ contextMenuRef }
                        initialDate={ initialDate }
                        commands={
                            {
                                refreshToken: () => setRefreshToken({ ...{} }),
                                showWorkDatePicker: () =>  showWorkDatePicker(),
                                fitToMap: () => {
                                    TrackMap.fitToMap();
                                }
                            }
                        }
                    />
                </Button>
            </ToolbarItem>
        </Popup>
    );
};
export default TrackMapPopup;
