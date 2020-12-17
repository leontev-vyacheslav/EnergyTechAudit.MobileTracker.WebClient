import { MdLocationOn, MdPerson } from 'react-icons/md';
import React from 'react';
import { useScreenSize } from '../../../../utils/media-query';

export function TimelineInfoHeader ({ currentMobileDevice, departure, destination }) {
    const { isXSmall } = useScreenSize();

    return <>
        <div className={ 'timeline-info-user' }>
            <MdPerson size={ 24 }/>
            <div>{!isXSmall ? 'Пользователь:' : ''}{ currentMobileDevice.email } / { currentMobileDevice.model }</div>
        </div>
        { destination !== null ?
            <div className={ 'timeline-info-points' }>
                <div className={ 'departure' }>
                    <MdLocationOn size={ 18 }/>
                    <div>{ departure }</div>
                </div>
                <div className={ 'destination' }>
                    <MdLocationOn size={ 18 }/>
                    <div>{ destination }</div>
                </div>
            </div>
            : null
        }
    </>;
}
