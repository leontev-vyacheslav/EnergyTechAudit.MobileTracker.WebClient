import React from 'react';
import PropTypes from 'prop-types';
import { CountdownIcon, RadiusIcon } from '../../../../../constants/app-icons';
import './track-map-stationary-zones-list-item.scss';
import { useTrackMapStationaryZonesContext } from '../../track-map-contexts/track-map-stationary-zones-context';

const TrackMapStationaryZonesListItem = ({ stationaryCluster }) => {
    const { stationaryClusterList, showInfoWindowAsync,  setCurrentStationaryCluster } = useTrackMapStationaryZonesContext();
    return (
        <>
            <div className={ 'track-map-stationary-zones-list-item' } onClick={ async () => {
                const cluster = stationaryClusterList.find( c => c.index === stationaryCluster.index);
                if(cluster) {
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
                        { stationaryCluster.addresses.map((a, i) => {
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

TrackMapStationaryZonesListItem.propTypes = {
    stationaryCluster: PropTypes.shape({
        index: PropTypes.number.isRequired,
        radius: PropTypes.number.isRequired,
        elements: PropTypes.array.isRequired
    })
}


export default TrackMapStationaryZonesListItem;
