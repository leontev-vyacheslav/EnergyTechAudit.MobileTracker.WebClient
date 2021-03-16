import React from 'react';
import { CountdownIcon, RadiusIcon, StationaryZoneOffIcon } from '../../../../../constants/app-icons';
import './track-map-stationary-zones-list-item.scss';

const TrackMapStationaryZonesListItem = ({ stationaryCluster, onClick }) => {

    return (
        <div className={ 'track-map-stationary-zones-list-item' } onClick={ onClick }>
            <div>
                <StationaryZoneOffIcon size={ 22 }/>
            </div>
            <div >
                <span>{ `Зона стационарности ${ stationaryCluster.cluster.index + 1 }` }</span>
            </div>
            <div>
                <div>
                    <div className={ 'track-map-stationary-zones-list-item-info' }>
                        <CountdownIcon size={ 18 }/>
                        <span>{ `${ stationaryCluster.cluster.elements.length }` }</span>
                    </div>
                    <div className={ 'track-map-stationary-zones-list-item-info' }>
                        <RadiusIcon size={ 18 }/>
                        <span>{ `${ Math.floor(stationaryCluster.radius * 10) / 10 } м` }</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default TrackMapStationaryZonesListItem;
