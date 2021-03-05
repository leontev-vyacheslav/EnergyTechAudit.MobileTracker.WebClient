import React, { useState, useRef } from 'react';
import TrackMap from './track-map/track-map';
import { Popup } from 'devextreme-react/popup';
import { ToolbarItem } from 'devextreme-react/popup';
import { useScreenSize } from '../../../utils/media-query';
import { useSharedArea } from '../../../contexts/shared-area';
import { Button } from 'devextreme-react/button';
import TrackMapPopupMenu from './track-map-popup-menu/track-map-popup-menu'
import { AdditionalMenuIcon, WorkDateBackwardIcon, WorkDateForwardIcon, WorkDateTodayIcon } from '../../../constants/app-icons';
import { useAppSettings } from '../../../contexts/app-settings';
import Moment from 'moment';
import { TrackMapStationaryZonesProvider } from './track-map-contexts/track-map-stationary-zones-context';
import { TrackMapUtilsProvider } from './track-map-contexts/track-map-utils-context';

const TrackMapPopup = ({ mobileDevice, timelineItem, initialDate, onClose }) => {
    const { isXSmall, isSmall } = useScreenSize();
    const { setAppSettingsData } = useAppSettings();
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
                       <TrackMapUtilsProvider>
                           <TrackMapStationaryZonesProvider>
                               <TrackMap
                                   mobileDevice={ mobileDevice }
                                   timelineItem={ timelineItem }
                                   initialDate={ initialDate }
                                   refreshToken={ refreshToken }
                               />
                           </TrackMapStationaryZonesProvider>
                       </TrackMapUtilsProvider>
                   );
               } }>
            <ToolbarItem location={ 'after' }>

                <Button className={ 'app-popup-header-menu-button' } hint='Сегодня' onClick={ () => {
                    setAppSettingsData(previous => {
                        const workDate = new Date();
                        workDate.setHours(0, 0, 0, 0);
                        return { ...previous, workDate: workDate };
                    });
                } }>
                    <WorkDateTodayIcon size={ 18 }/>
                </Button>

                <Button className={ 'app-popup-header-menu-button' } hint='Назад' onClick={ () => {
                    setAppSettingsData(previous => {
                        const workDate = Moment(previous.workDate).add(-1, 'days').toDate();
                        workDate.setHours(0, 0, 0, 0);
                        return { ...previous, workDate: workDate };
                    });
                } }>
                    <WorkDateBackwardIcon size={ 18 }/>
                </Button>

                <Button className={ 'app-popup-header-menu-button' } hint='Вперед' onClick={ () => {
                    setAppSettingsData(previous => {
                        const workDate = Moment(previous.workDate).add(+1, 'days').toDate();
                        workDate.setHours(0, 0, 0, 0);
                        return { ...previous, workDate: workDate };
                    });
                } }>
                    <WorkDateForwardIcon size={ 18 }/>
                </Button>

                <Button className={ 'app-popup-header-menu-button' } onClick={ (e) => {
                    contextMenuRef.current.instance.option('target', e.element);
                    contextMenuRef.current.instance.show();
                } }>
                    <AdditionalMenuIcon size={ 18 }/>
                    <TrackMapPopupMenu
                        ref={ contextMenuRef }
                        initialDate={ initialDate }
                        commands={
                            {
                                refreshToken: () => setRefreshToken({ ...{} }),
                                showWorkDatePicker: () => showWorkDatePicker(),
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
