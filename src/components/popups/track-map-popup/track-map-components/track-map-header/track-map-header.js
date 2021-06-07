import React from 'react';
import PropTypes from 'prop-types';
import SelectBox from 'devextreme-react/select-box';
import { UserIcon } from '../../../../../constants/app-icons';
import { TrackMapTimelineItem } from '../track-map-timeline-item/track-map-timeline-item';
import { useScreenSize } from '../../../../../utils/media-query';
import { useTrackMapTimelineContext } from '../../track-map-contexts/track-map-timeline-context';
import { getUserDeviceDescription } from '../../../../../utils/string-helper';

import './track-map-header.scss';
import List from 'devextreme-react/ui/list';

const TrackMapHeader = ({ mobileDevice }) => {

    const { isXSmall } = useScreenSize();
    const { currentTimeline, currentTimelineItem, setCurrentTimelineItem } = useTrackMapTimelineContext();

    return (
        <div className={ 'track-map-header' }>
            <div className={ 'track-map-header-email' } style={ { display: !isXSmall ? 'flex' : 'none', alignItems: 'center' } }>
                <UserIcon size={ 22 }/>
                <div>{ getUserDeviceDescription(mobileDevice) }</div>
            </div>
            <div className={ 'track-map-select-box-container' } style={ { width: !isXSmall ? '300px' : '100%' } }>
                { currentTimeline && currentTimelineItem ? (
                    <SelectBox
                        className={ 'track-map-header-select-box' }
                        dataSource={ currentTimeline }
                        selectionMode="single"
                        keyExpr={ 'id' }
                        displayExpr={ () => `${ currentTimelineItem.beginDate.toLocaleTimeString('ru-RU') } - ${ currentTimelineItem.endDate.toLocaleTimeString('ru-RU') }` }
                        onSelectionChanged={ (e) => {
                            const timeLineItem = currentTimeline.find(ti => ti.id === e.selectedItem.id);
                            if(timeLineItem) {
                                setCurrentTimelineItem(timeLineItem)
                            }
                        } }
                        itemRender={ (timelineItem) => <TrackMapTimelineItem timelineItem={ timelineItem }/> }
                    /> ) : null }
            </div>
        </div>
    );
}

TrackMapHeader.propTypes = {
    mobileDevice: PropTypes.object.isRequired
}

export default TrackMapHeader;
