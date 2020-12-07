import React from 'react';
import { MdDateRange, MdPerson, MdSmartphone, MdTimer, MdTimerOff } from 'react-icons/all';
import './track-map-info-box.scss';

const TrackMapInfoBox = ({ mobileDevice, timelineItem }) => {
    const timeFormat = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const beginDate = new Date(Date.parse(timelineItem.beginDate));
    const endDate = new Date(Date.parse(timelineItem.endDate));
    endDate.setTime(endDate.getTime() -  1000);

    return (
        <div className={ 'track-map-info-box' }>
            <div className={ 'track-map-info-box-item' }>
                <MdPerson size={ 18 }/>
                <div>{ mobileDevice.email }</div>
            </div>
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
                <div>c { beginDate.toLocaleTimeString('ru-RU', timeFormat) }</div>
            </div>
            <div className={ 'track-map-info-box-item' }>
                <MdTimerOff size={ 18 }/>
                <div>до { endDate.toLocaleTimeString('ru-RU', timeFormat) }</div>
            </div>
        </div>
    );
}

export default TrackMapInfoBox;
