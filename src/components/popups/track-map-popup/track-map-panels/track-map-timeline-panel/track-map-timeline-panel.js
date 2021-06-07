import React from 'react';
import List from 'devextreme-react/ui/list';
import TrackMapPanelHeader from '../track-map-panel-header/track-map-panel-header';
import { useTrackMapSettingsContext } from '../../track-map-contexts/track-map-settings-context';
import { useTrackMapTimelineContext } from '../../track-map-contexts/track-map-timeline-context';
import { TrackMapTimelineItem } from '../../track-map-components/track-map-timeline-item/track-map-timeline-item';
import { TimelineIcon } from '../../../../../constants/app-icons';

const TrackMapTimelinePanel = () => {

    const { setIsShowTrackMapTimeline } = useTrackMapSettingsContext();
    const { currentTimeline, currentTimelineItem, setCurrentTimelineItem } = useTrackMapTimelineContext();
    return  currentTimeline && currentTimelineItem ? (
        <div style={ { height: 'calc(100% - 35px)' } }>
            <TrackMapPanelHeader title={ 'Хронология' } icon={ () => <TimelineIcon size={ 22 }/> } onClose={ () => {
                setIsShowTrackMapTimeline(false);
            } }/>
            <List className={ 'app-list' } height={ '100%' }
                  dataSource={ currentTimeline }
                  keyExpr={ 'id' }
                  showSelectionControls={ true }
                  selectionMode="single"
                  onSelectionChanged={ (e) => {
                      const selectedItem = e.component.option('selectedItems').find(ti =>!!ti);
                      setCurrentTimelineItem(currentTimeline.find(ti=> ti.id === (selectedItem ? selectedItem.id : 0)));
                  } }
                  itemRender={ (timelineItem) =>
                      <TrackMapTimelineItem timelineItem={ timelineItem }/>
                   }
            />
        </div>
    ) : null
}
export default TrackMapTimelinePanel;
