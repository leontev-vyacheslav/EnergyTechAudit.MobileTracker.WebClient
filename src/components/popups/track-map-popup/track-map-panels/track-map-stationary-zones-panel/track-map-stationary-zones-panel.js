import React, { useEffect, useState } from 'react';
import List from 'devextreme-react/ui/list';
import TrackMapStationaryZonesListItem from './track-map-stationary-zones-list-item';
import TrackMapPanelHeader from '../track-map-panel-header/track-map-panel-header';
import { useTrackMapSettingsContext } from '../../track-map-contexts/track-map-settings-context';
import { useTrackMapStationaryZonesContext } from '../../track-map-contexts/track-map-stationary-zones-context';
import { StationaryZonesIcon } from '../../../../../constants/app-icons';
import { useAppData } from '../../../../../contexts/app-data';
import AppConstants from '../../../../../constants/app-constants';
import { useAppSettings } from '../../../../../contexts/app-settings';

const TrackMapStationaryZonesPanel = () => {
    const { stationaryClusterList, showInfoWindowAsync, currentStationaryCluster, setCurrentStationaryCluster } = useTrackMapStationaryZonesContext();
    const { setIsShowTrackMapZones } = useTrackMapSettingsContext();
    const [currentStationaryClusterList, setCurrentStationaryClusterList] = useState([]);
    const { getGeocodedAddressesAsync } = useAppData();
    const { appSettingsData } = useAppSettings();

    useEffect(() => {
        ( async () => {
            if (appSettingsData.useStationaryZoneAddresses === true) {
                const result = [];
                for (const stationaryCluster of stationaryClusterList) {
                    let formattedAddress = [];

                    const addresses = await getGeocodedAddressesAsync({
                        latitude: stationaryCluster.cluster.centroid.lat(),
                        longitude: stationaryCluster.cluster.centroid.lng(),
                    });
                    if (addresses) {
                        formattedAddress = addresses
                            .filter(a => a.types.includes('street_address') || a.types.includes('premise'))
                            .map(a => a.formatted_address)
                            .filter((val, indx, arr) => arr.indexOf(val) === indx);
                    }
                    if (formattedAddress.length === 0) {
                        formattedAddress.push(AppConstants.noDataLongText);
                    }
                    stationaryCluster.cluster.addresses = formattedAddress;
                    result.push({ ...stationaryCluster });
                }
                setCurrentStationaryClusterList([...result]);
            } else {
                setCurrentStationaryClusterList([...stationaryClusterList]);
            }
        } )();
    }, [appSettingsData.useStationaryZoneAddresses, getGeocodedAddressesAsync, stationaryClusterList]);

    return (
        <div style={ { height: 'calc(100% - 35px)' } }>
            <TrackMapPanelHeader title={ 'Зоны стационарности' } icon={ () => <StationaryZonesIcon size={ 22 }/> } onClose={ () => {
                setIsShowTrackMapZones(false);
            } }/>
            <List className={ 'app-list' }
                  dataSource={ currentStationaryClusterList }
                  height={ '100%' }
                  selectionMode="single"
                  selectedItems={ [currentStationaryCluster] }
                  itemRender={ (stationaryCluster) => {
                      return <TrackMapStationaryZonesListItem stationaryCluster={ stationaryCluster } onClick={ async () => {
                          await showInfoWindowAsync(stationaryCluster);
                          setCurrentStationaryCluster(stationaryCluster);
                      } }/>
                  } }>
            </List>
        </div>
    );
}

export default TrackMapStationaryZonesPanel;
