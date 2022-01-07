import React from 'react';
import TabPanel, { Item } from 'devextreme-react/ui/tab-panel';
import Timelines from '../timeline/timelines';
import StationaryZones from '../stationary-zones/stationary-zones';
import BackgroundStatuses from '../background-statuses/background-statuses';
import IconTab from '../../../components/tab-utils/icon-tab';
import { StationaryZonesIcon, StatusInfoIcon, TimelineIcon } from '../../../constants/app-icons';

import './mobile-devices-master-detail-view.scss';
import { MobileDeviceWorkDateModel } from '../../../models/mobile-device-work-date-model';

const MobileDevicesMasterDetailView = ({ mobileDevice, workDate }: MobileDeviceWorkDateModel) => {
    return (
        <TabPanel className={ 'app-tab-panel mobile-device-master-detail-tab-panel' }>
            <Item title={ 'Хронология' }
                  tabRender={ (tab) => <IconTab tab={ tab }><TimelineIcon size={ 18 }/></IconTab> }
                  render={ () => <Timelines mobileDevice={ mobileDevice } workDate={ workDate }/> }
            />
            <Item title={ 'Зоны' }
                  tabRender={ (tab) => <IconTab tab={ tab }><StationaryZonesIcon size={ 18 }/></IconTab> }
                  render={ () => <StationaryZones mobileDevice={ mobileDevice } workDate={ workDate }/> }
            />
            <Item title={ 'Статусы' }
                  tabRender={ (tab) => <IconTab tab={ tab }><StatusInfoIcon size={ 18 }/></IconTab> }
                  render={ () => <BackgroundStatuses mobileDevice={ mobileDevice } workDate={ workDate }/> }
            />
        </TabPanel>
    );
};

export default MobileDevicesMasterDetailView;
