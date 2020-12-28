import React from 'react';
import { useScreenSize } from '../../../../utils/media-query';
import { LocationIcon, UserIcon } from '../../../../utils/app-icons';

export function TimelineInfoHeader ({ currentMobileDevice, departure, destination }) {
    const { isXSmall } = useScreenSize();

    return <>
        <div className={ 'timeline-info-user' }>
            <UserIcon size={ 24 }/>
            <div>{!isXSmall ? 'Пользователь: ' : ''}{ currentMobileDevice.email } / { currentMobileDevice.model }</div>
        </div>
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
