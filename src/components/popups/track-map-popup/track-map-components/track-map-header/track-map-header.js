import React from 'react';
import SelectBox from 'devextreme-react/select-box';
import { UserIcon } from '../../../../../constants/app-icons';
import { TrackMapTimelineItem } from '../track-map-timeline-item/track-map-timeline-item';
import { useScreenSize } from '../../../../../utils/media-query';
import { useTrackMapTimelineContext } from '../../track-map-contexts/track-map-timeline-context';

import './track-map-header.scss';

const TrackMapHeader = ({ mobileDevice }) => {

    const { isXSmall } = useScreenSize();
    const { currentTimeline, currentTimelineItem, setCurrentTimelineItem } = useTrackMapTimelineContext();

    return (
        <div className={ 'track-map-header' }>
            <div className={ 'track-map-header-email' } style={ { display: !isXSmall ? 'flex' : 'none', alignItems: 'center' } }>
                <UserIcon size={ 22 }/>
                <div>{ mobileDevice.email }</div>
            </div>
            <div className={ 'track-map-select-box-container' } style={ { width: !isXSmall ? '300px' : '100%' } }>
                { currentTimeline && currentTimelineItem ? (
                    <SelectBox
                        className={ 'track-map-header-select-box' }
                        dataSource={ currentTimeline }
                        selectionMode="single"
                        value={ currentTimelineItem }
                        displayExpr={ () => `${ currentTimelineItem.beginDate.toLocaleTimeString('ru-RU') } - ${ currentTimelineItem.endDate.toLocaleTimeString('ru-RU') }` }
                        onSelectionChanged={ (e) => {
                            setCurrentTimelineItem(e.selectedItem)
                        } }
                        itemRender={ (timelineItem) => <TrackMapTimelineItem timelineItem={ timelineItem }/> }
                    /> ) : null }
            </div>
        </div>
    );
};

export default TrackMapHeader;
