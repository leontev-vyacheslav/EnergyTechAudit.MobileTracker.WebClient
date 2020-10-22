import React from 'react';
import { MdDateRange, MdPerson, MdSmartphone, MdTimer, MdTimerOff } from 'react-icons/all';
import './track-map-info-box.scss';

const TrackMapInfoBox = ({ mobileDevice, timelineItem }) => {
    return (
        <div className={ 'track-map-info-box' }>
            <div className={ 'track-map-info-box-item' }>
                <MdPerson size={ 18 }/>
                <div>{ mobileDevice.userName }</div>
            </div>
            <div className={ 'track-map-info-box-item' }>
                <MdSmartphone size={ 18 }/>
                <div>{ mobileDevice.model }</div>
            </div>
            <div className={ 'track-map-info-box-item' }>
                <MdDateRange size={ 18 }/>
                <div>{ new Date(Date.parse(timelineItem.beginDate)).toLocaleDateString('ru') }</div>
            </div>

            <div className={ 'track-map-info-box-item' }>
                <MdTimer size={ 18 }/>
                <div>c { new Date(Date.parse(timelineItem.beginDate)).toLocaleTimeString('ru') }</div>
            </div>
            <div className={ 'track-map-info-box-item' }>
                <MdTimerOff size={ 18 }/>
                <div>до { new Date(Date.parse(timelineItem.endDate)).toLocaleTimeString('ru') }</div>
            </div>
        </div>
    );
}

export default TrackMapInfoBox;
