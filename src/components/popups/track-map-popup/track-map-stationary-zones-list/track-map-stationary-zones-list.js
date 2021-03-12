import React from 'react';
import List, { Item } from 'devextreme-react/ui/list';
import { useTrackMapStationaryZonesContext } from '../track-map-contexts/track-map-stationary-zones-context';
import { uuidv4 } from '../../../../utils/uuid';
import TrackMapStationaryZonesListItemContent from './track-map-stationary-zones-list-item-content';

const TrackMapStationaryZonesList = () => {

    const { stationaryClusterList, showInfoWindowAsync } = useTrackMapStationaryZonesContext();
    return (
        <div style={ { height: '100%' } }>
            <List className={ 'app-list' } height={ '100%' } showSelectionControls={ true } selectionMode="single">
                { stationaryClusterList.map((circle, index) => (
                        <Item key={ uuidv4() }
                              onClick={ () => {
                                  showInfoWindowAsync(circle);
                              } }>
                            <TrackMapStationaryZonesListItemContent circle={ circle } index={ index }/>
                        </Item>
                    )
                ) }
            </List>
        </div>
    );
}

export default TrackMapStationaryZonesList;
