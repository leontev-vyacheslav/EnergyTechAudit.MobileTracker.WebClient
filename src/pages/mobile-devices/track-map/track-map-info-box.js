import React from 'react';
import { MdDateRange, MdPerson, MdSmartphone, MdTimer, MdTimerOff } from 'react-icons/all';

const TrackMapInfoBox = ({mobileDevice, timelineItem}) => {
    return (
        <div className={ 'track-map-info-box' } >
            <div className={'track-map-info-box-item'}>
                <MdPerson size={18} />
                <div>{ mobileDevice.userName }</div>
            </div>
            <div className={'track-map-info-box-item'} style={{display: 'flex', alignItems: 'center'}}>
                <MdSmartphone size={18} />
                <div>{ mobileDevice.model }</div>
            </div>
            <div className={'track-map-info-box-item'} style={{display: 'flex', alignItems: 'center'}}>
                <MdDateRange  size={18} />
                <div>{ new Date (Date.parse(timelineItem.beginDate)).toLocaleDateString('ru') }</div>
            </div>

            <div className={'track-map-info-box-item'} style={{display: 'flex', alignItems: 'center'}}>
                <MdTimer  size={18} />
                <div>c { new Date (Date.parse(timelineItem.beginDate)).toLocaleTimeString('ru') }</div>
            </div>
            <div className={'track-map-info-box-item'} style={{display: 'flex', alignItems: 'center'}}>
                <MdTimerOff  size={18} />
                <div>до { new Date (Date.parse(timelineItem.endDate)).toLocaleTimeString('ru') }</div>
            </div>
        </div>
    );
}

export default TrackMapInfoBox;
