import React from 'react';
import { CountdownIcon, RadiusIcon } from '../../../../../constants/app-icons';
import './track-map-stationary-zones-list-item.scss';
import { useTrackMapStationaryZonesContext } from '../../track-map-contexts/track-map-stationary-zones-context';
import { Cluster } from '../../../../../models/cluster';

export type TrackMapStationaryZonesListItemProps = {
  stationaryCluster: Cluster
}

const TrackMapStationaryZonesListItem = ({ stationaryCluster }: TrackMapStationaryZonesListItemProps) => {
    const { stationaryClusterList, showInfoWindowAsync,  setCurrentStationaryCluster } = useTrackMapStationaryZonesContext();
    return (
        <>
            <div className={ 'track-map-stationary-zones-list-item' } onClick={ async () => {
                const cluster = stationaryClusterList.find( (c: Cluster) => c.index === stationaryCluster.index);
                if (cluster) {
                    setCurrentStationaryCluster(cluster)
                    await showInfoWindowAsync(cluster.index);
                }
            } }>
                <div>
                    <span>{ `Зона стационарности ${ stationaryCluster.index + 1 }` }</span>
                </div>
                <div>
                        <div className={ 'track-map-stationary-zones-list-item-info' }>
                            <CountdownIcon size={ 18 }/>
                            <span>{ `${ stationaryCluster.elements.length }` }</span>
                        </div>
                        <div className={ 'track-map-stationary-zones-list-item-info' }>
                            <RadiusIcon size={ 18 }/>
                            <span>{ `${ Math.floor(stationaryCluster.radius * 10) / 10 } м` }</span>
                        </div>

                </div>
                { stationaryCluster.addresses && stationaryCluster.addresses.length > 0 ?
                    <div>
                        { stationaryCluster.addresses.map((a: string, i: number) => {
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
