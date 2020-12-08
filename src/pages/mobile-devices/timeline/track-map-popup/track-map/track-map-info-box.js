import React from 'react';
import { MdDateRange, MdSmartphone, MdTimer, MdTimerOff } from 'react-icons/all';
import './track-map-info-box.scss';

const TrackMapInfoBox = ({ mobileDevice, timelineItem }) => {

    const beginDate = new Date(timelineItem.beginDate);
    const endDate = new Date(timelineItem.endDate);
    endDate.setTime(endDate.getTime() -  1000);

    return (
        <div className={ 'track-map-info-box' }>
            <div className={ 'track-map-info-box-item' }>
                <MdSmartphone size={ 18 }/>
                <div>{ mobileDevice.model }</div>
            </div>
            <div className={ 'track-map-info-box-item' }>
                <MdDateRange size={ 18 }/>
                <div>{ beginDate.toLocaleDateString('ru-RU') }</div>
            </div>

            <div className={ 'track-map-info-box-item' }>
                <MdTimer size={ 18 }/>
                <div>c { beginDate.toLocaleTimeString('ru-RU') }</div>
            </div>
            <div className={ 'track-map-info-box-item' }>
                <MdTimerOff size={ 18 }/>
                <div>до { endDate.toLocaleTimeString('ru-RU') }</div>
            </div>
        </div>
    );
}

export default TrackMapInfoBox;
