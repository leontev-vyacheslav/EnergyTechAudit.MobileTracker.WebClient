import React from 'react';
import AppConstants from '../../../../../constants/app-constants';
import { useScreenSize } from '../../../../../utils/media-query';

import { MdTimer } from 'react-icons/md';
import { BiHorizontalCenter } from 'react-icons/bi';
import { IoIosWalk, IoMdBatteryCharging } from 'react-icons/io';
import { IoBatteryChargingOutline, IoSpeedometerOutline } from 'react-icons/io5';
import { BsBuilding } from 'react-icons/bs';

import './track-map-info-window.scss'

const TrackMapInfoWindow = ({ locationRecord, address }) => {
    const { isXSmall, isSmall } = useScreenSize();
    const activityTypeDescription = AppConstants.motionActivityTypeDictionary.find(atd => atd.id === locationRecord.motionActivityTypeId);


    const dataSheet = [
        {
            id: 1,
            icon: (props) => <MdTimer { ...props }/>,
            description: 'Время:',
            value: new Date(locationRecord.mobileDeviceDateTime).toLocaleString('ru-RU')
        },
        {
            id: 2,
            icon: (props) => <BiHorizontalCenter { ...props }/>,
            description: 'Точность:',
            value: locationRecord.accuracy
        },
        {
            id: 3,
            icon: (props) => <IoIosWalk { ...props }/>,
            description: 'Активность:',
            value: activityTypeDescription ? activityTypeDescription.description : locationRecord.motionActivityTypeId
        },
        {
            id: 4,
            icon: (props) => <IoSpeedometerOutline { ...props }/>,
            description: 'Скорость:',
            value: locationRecord.speed < 0 ? '-' : `${ Math.floor(locationRecord.speed * 3.6 * 100) / 100 } км/ч`
        },
        {
            id: 5,
            icon: (props) => <IoMdBatteryCharging { ...props }/>,
            description: 'Уровень заряда:',
            value: `${ Math.floor(locationRecord.batteryLevel * 100 * 100) / 100 } %`
        },
        {
            id: 6,
            icon: (props) => <IoBatteryChargingOutline { ...props }/>,
            description: 'На зарядке:',
            value: locationRecord.isCharging ? 'Да' : 'Нет'
        }
    ];

    return (

        <table className={ 'simple-grid' } style={ isXSmall ? { fontSize: 10 } : ( isSmall ? { fontSize: 11 } : {} ) }>
            { address !== null ? (
                <thead>
                    <tr>
                        <td style={ { padding: 5 } } colSpan={ 2 }>
                            <div style={ { display: 'grid', gridTemplateColumns: '20px 1fr', gap: 10, alignItems: 'center' } }>
                                <BsBuilding size={ 22 }/>
                                <span style={ { fontWeight: 500 } }>{ address ?? AppConstants.noDataLongText }</span>
                            </div>
                        </td>
                    </tr>
                </thead> )
                : null
            }
            <tbody>
            { dataSheet.map(d =>
                <tr key={ d.id }>
                    <td>
                        <div style={ { display: 'grid', gridTemplateColumns: '20px 1fr', gap: 5, alignItems: 'center' } }>
                            { d.icon({ size: 18 }) }
                            <span>{ d.description }</span>
                        </div>
                    </td>
                    <td><span>{ d.value }</span></td>
                </tr>
            ) }
            </tbody>
        </table>
    );
};

export default TrackMapInfoWindow;
