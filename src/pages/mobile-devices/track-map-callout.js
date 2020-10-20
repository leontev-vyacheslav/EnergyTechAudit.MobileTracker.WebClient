import React from 'react';
import './track-map-callout.scss'

const TrackMapCallout = ({ locationRecord }) => {
    return (
        <table className={ 'track-info-window' }>
            <tbody>
            <tr>
                {/*<td style="width: initial" colspan="2"><span>{trustedAddress.formatted_address}</span></td>*/ }
            </tr>
            <tr>
                <td><span>Время:</span></td>
                <td><span>{ locationRecord.mobileDeviceDateTime }</span></td>
            </tr>
            <tr>
                <td><span>Точность:</span></td>
                <td><span>{ locationRecord.accuracy } м</span></td>
            </tr>
            <tr>
                <td><span>Активность:</span></td>
                <td><span>{ locationRecord.motionActivityTypeId }</span></td>
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

export default TrackMapCallout;
