import React from 'react';
import TabPanel, { Item } from 'devextreme-react/ui/tab-panel';
import Timelines from '../timeline/timelines';
import StationaryZones from '../stationary-zones/stationary-zones';
import IconTab from '../../../components/tab-utils/icon-tab';
import { StationaryZonesIcon, TimelineIcon } from '../../../constants/app-icons';

import './mobile-devices-master-detail-view.scss';

const MobileDevicesMasterDetailView = ({ mobileDevice, workDate }) => {
    return (
        <TabPanel className={ 'mobile-device-master-detail-tab-panel' }>
            <Item title={ 'Хронология' }
                  tabRender={ (tab) => <IconTab tab={ tab }><TimelineIcon size={ 18 }/></IconTab> }
                  render={ () => {
                      return (
                          <Timelines mobileDevice={ mobileDevice } workDate={ workDate }/>
                      )
                  } }/>
            <Item title={ 'Зоны' }
                  tabRender={ (tab) => <IconTab tab={ tab }><StationaryZonesIcon size={ 18 }/></IconTab> }
                  render={ () => {
                      return (
                          <StationaryZones mobileDevice={ mobileDevice }/>
                      );
                  } }/>
        </TabPanel>
    );
};

export default MobileDevicesMasterDetailView;
