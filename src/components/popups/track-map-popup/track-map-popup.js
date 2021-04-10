import React, { useRef } from 'react';
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
import { TrackMapLocationRecordsProvider } from './track-map-contexts/track-map-location-records-context';
import { TrackMapTrackProvider } from './track-map-contexts/track-map-track-context';
import { TrackMapSettingsProvider } from './track-map-contexts/track-map-settings-context';
import { TrackMapTimelineProvider } from './track-map-contexts/track-map-timeline-context';
import { TrackMapStationaryZonesProvider } from './track-map-contexts/track-map-stationary-zones-context';

const TrackMapPopup = ({ mobileDevice, timelineItem, initialDate, onClose }) => {
    const { isXSmall, isSmall } = useScreenSize();
    const { setAppSettingsData, setWorkDateToday } = useAppSettings();
    const { showWorkDatePicker } = useSharedArea();
    const contextMenuRef = useRef();

    return (
        <TrackMapTimelineProvider mobileDevice={ mobileDevice } timelineItem={ timelineItem }>
            <TrackMapSettingsProvider>
                <Popup className={ 'app-popup track-map-popup' } title={ 'Карта маршрута' }
                       dragEnabled={ true }
                       visible={ true }
                       showTitle={ true }
                       showCloseButton={ true }
                       onHiding={ onClose }
                       width={ isXSmall || isSmall ? '95%' : '80%' }
                       height={ isXSmall || isSmall ? '95%' : '90%' }
                       contentRender={ () => {
                           return (
                               <TrackMapLocationRecordsProvider mobileDevice={ mobileDevice }>
                                   <TrackMapTrackProvider>
                                       <TrackMapStationaryZonesProvider>
                                           <TrackMap mobileDevice={ mobileDevice }/>
                                       </TrackMapStationaryZonesProvider>
                                   </TrackMapTrackProvider>
                               </TrackMapLocationRecordsProvider>
                           );
                       } }>
                    <ToolbarItem location={ 'after' }>

                        <Button className={ 'app-popup-header-menu-button' } hint='Сегодня' onClick={ () => {
                            setWorkDateToday();
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

                        <Button className={ 'app-popup-header-menu-button' } hint='Меню' onClick={ (e) => {
                            contextMenuRef.current.instance.option('target', e.element);
                            contextMenuRef.current.instance.show();
                        } }>
                            <AdditionalMenuIcon size={ 18 }/>
                            <TrackMapPopupMenu
                                ref={ contextMenuRef }
                                initialDate={ initialDate }
                                commands={
                                    {
                                        refresh: () => {
                                            setAppSettingsData(prev => {
                                                return { ...prev }
                                            })
                                        },
                                        showWorkDatePicker: () => showWorkDatePicker(),
                                        fitToMap: () => {
                                            TrackMapTrackProvider.fitMapBoundsByLocations();
                                        }
                                    }
                                }
                            />
                        </Button>
                    </ToolbarItem>
                </Popup>
            </TrackMapSettingsProvider>
        </TrackMapTimelineProvider>
    );
};
export default TrackMapPopup;
