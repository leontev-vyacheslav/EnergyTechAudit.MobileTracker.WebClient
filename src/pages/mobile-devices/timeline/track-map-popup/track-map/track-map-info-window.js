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
    const activityTypeDescription = AppConstants.motionActivityTypeDictionary.find(activity => activity.id === locationRecord.motionActivityTypeId);

    const dataSheet = [
        {
            id: 1,
            iconRender: (props) => <MdTimer { ...props }/>,
            description: 'Время:',
            value: new Date(locationRecord.mobileDeviceDateTime).toLocaleString('ru-RU')
        },
        {
            id: 2,
            iconRender: (props) => <BiHorizontalCenter { ...props }/>,
            description: 'Точность:',
            value: `${locationRecord.accuracy} м`
        },
        {
            id: 3,
            iconRender: (props) => <IoIosWalk { ...props }/>,
            description: 'Активность:',
            value: activityTypeDescription ? activityTypeDescription.description : locationRecord.motionActivityTypeId
        },
        {
            id: 4,
            iconRender: (props) => <IoSpeedometerOutline { ...props }/>,
            description: 'Скорость:',
            value: locationRecord.speed < 0 ? '-' : `${ Math.floor(locationRecord.speed * 3.6 * 100) / 100 } км/ч`
        },
        {
            id: 5,
            iconRender: (props) => <IoMdBatteryCharging { ...props }/>,
            description: 'Уровень заряда:',
            value: `${ Math.floor(locationRecord.batteryLevel * 100 * 100) / 100 } %`
        },
        {
            id: 6,
            iconRender: (props) => <IoBatteryChargingOutline { ...props }/>,
            description: 'На зарядке:',
            value: locationRecord.isCharging ? 'Да' : 'Нет'
        }
    ];

    return (
        <table className={ 'simple-grid track-map-info-window-grid' } style={ isXSmall ? { fontSize: 10 } : ( isSmall ? { fontSize: 11 } : {} ) }>
            { address !== null ? (
                <thead>
                    <tr>
                        <td colSpan={ 2 }>
                            <div className={ 'track-map-info-window-data-row' }>
                                <BsBuilding size={ 18 }/>
                                <span style={ { fontWeight: 500 } }>{ address ?? AppConstants.noDataLongText }</span>
                            </div>
                        </td>
                    </tr>
                </thead> )
                : null
            }
            <tbody>
            { dataSheet.map(dataItem =>
                <tr key={ dataItem.id }>
                    <td>
                        <div className={ 'track-map-info-window-data-row' }>
                            { dataItem.iconRender({ size: 18 }) }
                            <span>{ dataItem.description }</span>
                        </div>
                    </td>
                    <td><span>{ dataItem.value }</span></td>
                </tr>
            ) }
            </tbody>
        </table>
    );
};

export default TrackMapInfoWindow;
