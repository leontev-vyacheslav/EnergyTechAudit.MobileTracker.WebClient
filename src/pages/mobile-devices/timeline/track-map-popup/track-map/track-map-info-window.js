import React from 'react';
import './track-map-info-window.scss'
import AppConstants from '../../../../../constants/app-constants';

const TrackMapInfoWindow = ({ locationRecord, address }) => {
    const activityTypeDescription = AppConstants.motionActivityTypeDictionary.find(atd => atd.id === locationRecord.motionActivityTypeId);
    return (
        <table className={ 'track-map-info-window' }>
            <tbody>
            <tr>
                <td style={ { width: 'initial' } } colSpan={ 2 }><span>{ address }</span></td>
            </tr>
            <tr>
                <td><span>Время:</span></td>
                <td><span>{ new Date( locationRecord.mobileDeviceDateTime ).toLocaleString('ru-RU') }</span></td>
            </tr>
            <tr>
                <td><span>Точность:</span></td>
                <td><span>{ locationRecord.accuracy } м</span></td>
            </tr>
            <tr>
                <td><span>Активность:</span></td>
                <td><span>{ activityTypeDescription ? activityTypeDescription.description : locationRecord.motionActivityTypeId }</span></td>
            </tr>
            <tr>
                <td>
                    <span>Скорость:</span></td>
                <td><span>
                        { locationRecord.speed < 0 ? '-' : `${ Math.floor(locationRecord.speed * 3.6 * 100) / 100 } км/ч` }
                    </span>
                </td>
            </tr>
            <tr>
                <td><span>Уровень заряда:</span></td>
                <td><span>{ Math.floor(locationRecord.batteryLevel * 100 * 100) / 100 } %</span></td>
            </tr>
            <tr>
                <td><span>На зарядке:</span></td>
                <td><span>{ locationRecord.isCharging ? 'Да' : 'Нет' }</span></td>
            </tr>
            </tbody>
        </table>
    );
};

export default TrackMapInfoWindow;
