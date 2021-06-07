import React from 'react';
import List from 'devextreme-react/ui/list';
import TrackMapStationaryZonesListItem from './track-map-stationary-zones-list-item';
import TrackMapPanelHeader from '../track-map-panel-header/track-map-panel-header';
import { useTrackMapSettingsContext } from '../../track-map-contexts/track-map-settings-context';
import { StationaryZonesIcon } from '../../../../../constants/app-icons';
import { useTrackMapStationaryZonesContext } from '../../track-map-contexts/track-map-stationary-zones-context';

const TrackMapStationaryZonesPanel = () => {
    const { stationaryClusterList, currentStationaryCluster } = useTrackMapStationaryZonesContext();
    const { setIsShowTrackMapZones } = useTrackMapSettingsContext();
    return (
        <div style={ { height: 'calc(100% - 35px)' } }>
            <TrackMapPanelHeader title={ 'Зоны стационарности' } icon={ () => <StationaryZonesIcon size={ 22 }/> } onClose={ () => {
                setIsShowTrackMapZones(false);
            } }/>
                <List className={ 'app-list' }
                      dataSource={ stationaryClusterList }
                      height={ '100%' }
                      keyExpr={ 'index' }
                      selectionMode="single"
                      selectedItems={ [currentStationaryCluster] }
                      itemRender={ (stationaryCluster) => {
                          return <TrackMapStationaryZonesListItem stationaryCluster={ stationaryCluster }/>
                      } }
                   >
                </List>
        </div>
    );
}

export default TrackMapStationaryZonesPanel;
