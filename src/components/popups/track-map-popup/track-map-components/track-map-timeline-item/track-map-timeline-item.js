import React from 'react';
import PropTypes from 'prop-types';
import { BeginDateIcon, EndDateIcon } from '../../../../../constants/app-icons';

export const TrackMapTimelineItem = ({ timelineItem }) => {
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
    timelineItem: PropTypes.objectOf(
            PropTypes.shape({
                beginDate: PropTypes.instanceOf(Date),
                endDate: PropTypes.instanceOf(Date)
            })
    ).isRequired
}
