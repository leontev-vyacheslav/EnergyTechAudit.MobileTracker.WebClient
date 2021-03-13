import React from 'react';
import { CountdownIcon, RadiusIcon, StationaryZoneOff } from '../../../../../constants/app-icons';
import './track-map-stationary-zones-list-item.scss';

const TrackMapStationaryZonesListItem = ({ circle, index }) => {

    return (
        <div className={ 'track-map-stationary-zones-list-item' }>
            <div>
                <StationaryZoneOff size={ 24 }/>
            </div>
            <div >
                <span>{ `Зона стационарности ${ index + 1 }` }</span>
            </div>
            <div>
                <div>
                    <div className={ 'track-map-stationary-zones-list-item-info' }>
                        <CountdownIcon size={ 18 }/>
                        <span>{ `${ circle.cluster.elements.length }` }</span>
                    </div>
                    <div className={ 'track-map-stationary-zones-list-item-info' }>
                        <RadiusIcon size={ 18 }/>
                        <span>{ `${ Math.floor(circle.radius * 10) / 10 } м` }</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default TrackMapStationaryZonesListItem;
