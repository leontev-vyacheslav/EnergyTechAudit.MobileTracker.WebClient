import React, { useState, useRef } from 'react';
import TrackMap from './track-map/track-map';
import { Popup } from 'devextreme-react/ui/popup';
import { ToolbarItem } from 'devextreme-react/popup';
import { useScreenSize } from '../../../../utils/media-query';
import { useSharedArea } from '../../../../contexts/shared-area';

import './track-map-popup.scss';
import { MdMoreVert } from 'react-icons/md';
import { Button } from 'devextreme-react/ui/button';
import ContextMenu from 'devextreme-react/context-menu';

const TrackMapPopup = ({ mobileDevice, timelineItem, onHiding }) => {
    const { isXSmall, isSmall } = useScreenSize();
    const [refreshToken, setRefreshToken] = useState({});
    const { showWorkDatePicker } = useSharedArea();
    const contextMenuRef = useRef();
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
                <Button id={ 'track-map-popup-menu' } onClick={ (e) => {
                    contextMenuRef.current.instance.option('target', e.element);
                    contextMenuRef.current.instance.show();
                } } >
                    <MdMoreVert size={ 18 }/>
                    <ContextMenu
                        ref={ contextMenuRef }
                        showEvent={ 'suppress' }
                        items={ [
                            {
                                text: 'Обновить',
                                icon: 'refresh',
                                onClick: (e) => {
                                    e.component.hide();
                                    setRefreshToken({ ...{} });
                                },
                            },
                            {
                                text: 'Рабочая дата',
                                icon: 'event',
                                onClick: (e) => {
                                    e.component.hide();
                                    showWorkDatePicker();
                                }
                            } ] }
                        position={ { my: 'top right', at: 'bottom right' } }
                    />
                </Button>
            </ToolbarItem>
        </Popup>
    );
};
export default TrackMapPopup;
