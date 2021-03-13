import React from 'react';
import List, { Item } from 'devextreme-react/ui/list';
import { useTrackMapStationaryZonesContext } from '../../track-map-contexts/track-map-stationary-zones-context';
import { getUuidV4 } from '../../../../../utils/uuid';
import TrackMapStationaryZonesListItem from './track-map-stationary-zones-list-item';
import { useAppSettings } from '../../../../../contexts/app-settings';
import TrackMapPanelHeader from '../track-map-panel-header/track-map-panel-header';
import { StationaryZoneOff } from '../../../../../constants/app-icons';

const TrackMapStationaryZonesPanel = () => {
    const { stationaryClusterList, showInfoWindowAsync } = useTrackMapStationaryZonesContext();
    const { setAppSettingsData } = useAppSettings();

    return (
        <div style={ { height: 'calc(100% - 35px)' } }>
            <TrackMapPanelHeader title={ 'Зоны стационарности' } icon={ () => <StationaryZoneOff size={ 20 } /> } onClose={ () => {
                setAppSettingsData(prev => ( { ...prev, isShowTrackMapZones: false } ))
            } }/>
            <List className={ 'app-list' } height={ '100%' } showSelectionControls={ true } selectionMode="single">
                { stationaryClusterList.map((circle, index) => (
                        <Item key={ getUuidV4() }
                              onClick={ () => {
                                  showInfoWindowAsync(circle);
                              } }>
                            <TrackMapStationaryZonesListItem circle={ circle } index={ index }/>
                        </Item>
                    )
                ) }
            </List>
        </div>
    );
}

export default TrackMapStationaryZonesPanel;
