import { MdLocationOn, MdPerson } from 'react-icons/md';
import React from 'react';

export function TimelineInfoHeader ({ currentMobileDevice, departure, destination }) {
    return <>
        <div className={ 'timeline-info-user' }>
            <MdPerson size={ 24 }/>
            <div> Пользователь: { currentMobileDevice.email } / { currentMobileDevice.model }</div>
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
