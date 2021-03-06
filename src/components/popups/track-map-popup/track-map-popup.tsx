import React, { useRef } from 'react';
import TrackMap from './track-map/track-map';
import { Popup, ToolbarItem } from 'devextreme-react/popup';
import { useScreenSize } from '../../../utils/media-query';
import { useSharedArea } from '../../../contexts/shared-area';
import { Button } from 'devextreme-react/button';
import TrackMapPopupMenu from './track-map-popup-menu/track-map-popup-menu'
import {
  AdditionalMenuIcon,
  WorkDateBackwardIcon,
  WorkDateForwardIcon,
  WorkDateTodayIcon
} from '../../../constants/app-icons';
import { useAppSettings } from '../../../contexts/app-settings';
import Moment from 'moment';
import { TrackMapLocationRecordsProvider } from './track-map-contexts/track-map-location-records-context';
import { TrackMapTrackProvider } from './track-map-contexts/track-map-track-context';
import { TrackMapSettingsProvider } from './track-map-contexts/track-map-settings-context';
import { TrackMapTimelineProvider } from './track-map-contexts/track-map-timeline-context';
import { TrackMapStationaryZonesProvider } from './track-map-contexts/track-map-stationary-zones-context';
import ContextMenu from 'devextreme-react/context-menu';
import { TrackMapPopupProps } from '../../../models/track-map-popup-props';
import { DialogConstants } from '../../../constants/app-dialog-constant';
import { ContextMenuItemItemModel } from '../../../models/context-menu-item-props';

const TrackMapPopup = ({ mobileDevice, workDate, callback }: TrackMapPopupProps) => {
    const { isXSmall, isSmall } = useScreenSize();
    const { setAppSettingsData, setWorkDateToday } = useAppSettings();
    const { showWorkDatePicker } = useSharedArea();
    const contextMenuRef = useRef<ContextMenu<ContextMenuItemItemModel>>(null);

    return (
        <TrackMapTimelineProvider mobileDevice={ mobileDevice } workDate={ workDate } >
            <TrackMapSettingsProvider>
                <Popup className={ 'app-popup track-map-popup' } title={ 'Карта маршрута' }
                       wrapperAttr={ { class: 'app-popup track-map-popup' } }
                       dragEnabled={ true }
                       visible={ true }
                       showTitle={ true }
                       showCloseButton={ true }
                       onHiding={ () => callback({ modalResult: DialogConstants.ModalResults.Close }) }
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
                        { !workDate ?
                            <>
                                <Button className={ 'app-popup-header-menu-button' } hint='Сегодня' onClick={ () => {
                                    setWorkDateToday();
                                } }>
                                    <WorkDateTodayIcon size={ 18 }/>
                                </Button>

                                <Button className={ 'app-popup-header-menu-button' } hint='Назад' onClick={ () => {
                                    setAppSettingsData(previous => {
                                        const workDate = Moment(previous.workDate)
                                            .add(-1, 'days')
                                            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                                            .toDate();
                                        return { ...previous, workDate: workDate };
                                    });

                                } }>
                                    <WorkDateBackwardIcon size={ 18 }/>
                                </Button>

                                <Button className={ 'app-popup-header-menu-button' } hint='Вперед' onClick={ () => {
                                    setAppSettingsData(previous => {
                                        const workDate = Moment(previous.workDate)
                                            .add(+1, 'days')
                                            .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
                                            .toDate();
                                        return { ...previous, workDate: workDate };
                                    });
                                } }>
                                    <WorkDateForwardIcon size={ 18 }/>
                                </Button>
                            </>
                            : null
                        }

                        <Button className={ 'app-popup-header-menu-button' } hint='Меню' onClick={ async e => {
                            contextMenuRef.current?.instance.option('target', e.element);
                            await contextMenuRef.current?.instance.show();
                        } }>
                            <AdditionalMenuIcon size={ 18 }/>
                            <TrackMapPopupMenu
                                ref={ contextMenuRef }
                                initialDate={ workDate }
                                commands={ {
                                    refresh: () => setAppSettingsData(prev => ( { ...prev, workDate: new Date(prev.workDate) } )),
                                    showWorkDatePicker: () => showWorkDatePicker(),
                                    fitToMap: () => (TrackMapTrackProvider as any).fitMapBoundsByLocations()
                                } }
                            />
                        </Button>
                    </ToolbarItem>
                </Popup>
            </TrackMapSettingsProvider>
        </TrackMapTimelineProvider>
    );
};

export default TrackMapPopup;
