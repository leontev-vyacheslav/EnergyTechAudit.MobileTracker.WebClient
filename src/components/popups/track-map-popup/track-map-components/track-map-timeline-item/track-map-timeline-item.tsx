import React from 'react';
import PropTypes from 'prop-types';
import { BeginDateIcon, EndDateIcon } from '../../../../../constants/app-icons';
import { TrackMapTimelineItemProps } from '../../../../../models/track-map-timeline-item-props';

export const TrackMapTimelineItem = ({ timelineItem }: TrackMapTimelineItemProps) => {
    return (
        <div style={ { display: 'flex', columnGap: 20 } }>
            <div style={ { display: 'flex', alignItems: 'center', columnGap: 10 } } className={ 'track-map-info-box-item' }>
                <BeginDateIcon size={ 18 }/>
                <div>c { timelineItem.beginDate.toLocaleTimeString('ru-RU') }</div>
            </div>
            <div style={ { display: 'flex', alignItems: 'center', columnGap: 10  } } className={ 'track-map-info-box-item' }>
                <EndDateIcon size={ 18 }/>
                <div>до { timelineItem.endDate.toLocaleTimeString('ru-RU') }</div>
            </div>
        </div>
    );
}

TrackMapTimelineItem.propTypes = {
    timelineItem: PropTypes.shape({
        id: PropTypes.number.isRequired,
        beginDate: PropTypes.instanceOf(Date),
        endDate: PropTypes.instanceOf(Date)
    }).isRequired
}
