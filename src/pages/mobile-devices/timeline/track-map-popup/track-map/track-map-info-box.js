import React from 'react';

import './track-map-info-box.scss';
import { BeginDateIcon, DateRangeIcon, EndDateIcon, MobileDeviceIcon } from '../../../../../utils/app-icons';

const TrackMapInfoBox = ({ mobileDevice, timelineItem }) => {

    const beginDate = new Date(timelineItem.beginDate);
    const endDate = new Date(timelineItem.endDate);
    endDate.setTime(endDate.getTime() -  1000);

    return (
        <div className={ 'track-map-info-box' }>
            <div className={ 'track-map-info-box-item' }>
                <MobileDeviceIcon size={ 18 }/>
                <div>{ mobileDevice.model }</div>
            </div>
            <div className={ 'track-map-info-box-item' }>
                <DateRangeIcon size={ 18 }/>
                <div>{ beginDate.toLocaleDateString('ru-RU') }</div>
            </div>

            <div className={ 'track-map-info-box-item' }>
                <BeginDateIcon size={ 18 }/>
                <div>c { beginDate.toLocaleTimeString('ru-RU') }</div>
            </div>
            <div className={ 'track-map-info-box-item' }>
                <EndDateIcon size={ 18 }/>
                <div>до { endDate.toLocaleTimeString('ru-RU') }</div>
            </div>
        </div>
    );
}

export default TrackMapInfoBox;
