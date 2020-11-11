import React from 'react';
import TrackMap from './track-map/track-map';
import { Popup } from 'devextreme-react/ui/popup';
import { useScreenSize } from '../../../../utils/media-query';
import { useAppSettings } from '../../../../contexts/app-settings';
import './track-map-popup.scss';

const TrackMapPopup = ({ mobileDevice, timelineItem, timeline, onHiding }) => {
    const { isXSmall, isSmall } = useScreenSize();
    const { appSettingsData } = useAppSettings();

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
                   let timelineWithAllDayItem = null;
                   if (timeline) {
                       const beginDateAllDay = new Date(appSettingsData.workDate);
                       const endDateAllDay = new Date(appSettingsData.workDate);
                       endDateAllDay.setHours(24);
                       const allDay = { id: 0, beginDate: beginDateAllDay.toISOString(), endDate: endDateAllDay.toISOString() };
                       timelineWithAllDayItem = [allDay, ...timeline]
                   }
                   return <TrackMap mobileDevice={ mobileDevice } timelineItem={ timelineItem } timeline={ timelineWithAllDayItem }/>
               } }>
        </Popup>
    );
};
export default TrackMapPopup;
