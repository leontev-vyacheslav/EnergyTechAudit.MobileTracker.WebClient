import React from 'react';
import { CountdownIcon, RadiusIcon } from '../../../../../constants/app-icons';
import './track-map-stationary-zones-list-item.scss';

const TrackMapStationaryZonesListItem = ({ stationaryCluster, onClick }) => {

    return (
        <>
            <div className={ 'track-map-stationary-zones-list-item' } onClick={ onClick }>
                <div>
                    <span>{ `Зона стационарности ${ stationaryCluster.cluster.index + 1 }` }</span>
                </div>
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
                { stationaryCluster.cluster.addresses && stationaryCluster.cluster.addresses.length > 0 ?
                    <div>
                        { stationaryCluster.cluster.addresses.map((a, i) => {
                            return (
                                <div style={ { whiteSpace: 'normal', fontSize: 13 } } key={ i }
                                     className={ 'track-map-stationary-zones-list-item-info' }>
                                    <span>{ a }</span>
                                </div>
                            );
                        }) }
                    </div>
                    : null
                }
            </div>
        </>
    );
}
export default TrackMapStationaryZonesListItem;
