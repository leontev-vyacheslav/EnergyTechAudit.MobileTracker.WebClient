import React from 'react';
import './track-map-info-box.scss';
import { BeginDateIcon, DateRangeIcon, EndDateIcon, MobileDeviceIcon } from '../../../../../constants/app-icons';
import { useTrackMapTimelineContext } from '../../track-map-contexts/track-map-timeline-context';
import { MobileDeviceModel } from '../../../../../models/mobile-device';
import { TrackMapTimelineContextModel } from '../../../../../models/track-map-timeline-provider-props';

const TrackMapInfoBox = ({ mobileDevice }: { mobileDevice: MobileDeviceModel }) => {

    const { currentTimelineItem }: TrackMapTimelineContextModel = useTrackMapTimelineContext();

    return (
        currentTimelineItem ?
            <div className={ 'track-map-info-box' }>
                <div className={ 'track-map-info-box-item' }>
                    <MobileDeviceIcon size={ 18 }/>
                    <div>{ mobileDevice?.model }</div>
                </div>
                <div className={ 'track-map-info-box-item' }>
                    <DateRangeIcon size={ 18 }/>
                    <div>{ currentTimelineItem.beginDate.toLocaleDateString('ru-RU') }</div>
                </div>

                <div className={ 'track-map-info-box-item' }>
                    <BeginDateIcon size={ 18 }/>
                    <div>c { currentTimelineItem.beginDate.toLocaleTimeString('ru-RU') }</div>
                </div>
                <div className={ 'track-map-info-box-item' }>
                    <EndDateIcon size={ 18 }/>
                    <div>до { currentTimelineItem.endDate.toLocaleTimeString('ru-RU') }</div>
                </div>
            </div> : null
    );
}

export default TrackMapInfoBox;
