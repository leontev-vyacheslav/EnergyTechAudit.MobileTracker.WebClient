import { MdLocationOn, MdPerson } from 'react-icons/md';
import React from 'react';

export function TimelineInfoHeader (props) {
    return <>
        <div className={ 'timeline-info-user' }>
            <MdPerson size={ 24 }/>
            <div> Пользователь: { props.currentMobileDevice.email } / { props.currentMobileDevice.model }</div>
        </div>
        <div className={ 'timeline-info-points' }>
            <div className={ 'departure' }>
                <MdLocationOn size={ 18 }/>
                <div>{ props.departure }</div>
            </div>
            <div className={ 'destination' }>
                <MdLocationOn size={ 18 }/>
                <div>{ props.destination }</div>
            </div>
        </div>
    </>;
}
