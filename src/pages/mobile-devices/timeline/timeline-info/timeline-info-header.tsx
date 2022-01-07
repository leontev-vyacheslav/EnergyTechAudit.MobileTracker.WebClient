import React from 'react';
import { useScreenSize } from '../../../../utils/media-query';
import { LocationIcon, UserIcon } from '../../../../constants/app-icons';
import { MobileDeviceModel } from '../../mobile-devices';

export type TimelineInfoHeaderProps = {
    mobileDevice: MobileDeviceModel,
    departure: string | null,
    destination: string | null
}

export function TimelineInfoHeader ({ mobileDevice, departure, destination }: TimelineInfoHeaderProps ) {
    const { isXSmall } = useScreenSize();

    return <>
        {mobileDevice ?
          <div className={ 'timeline-info-user' }>
              <UserIcon size={ 22 } />
              <div>{!isXSmall ? 'Пользователь: ' : ''}{mobileDevice.email} / {mobileDevice.model}</div>
          </div>
          : null
        }
        { destination !== null ?
            <div className={ 'timeline-info-points' }>
                <div className={ 'departure' }>
                    <LocationIcon size={ 18 }/>
                    <div>{ departure }</div>
                </div>
                <div className={ 'destination' }>
                    <LocationIcon size={ 18 }/>
                    <div>{ destination }</div>
                </div>
            </div>
            : null
        }
    </>;
}
