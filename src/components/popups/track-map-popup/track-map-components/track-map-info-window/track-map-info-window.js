import React, { useMemo } from 'react';
import AppConstants from '../../../../../constants/app-constants';
import { useScreenSize } from '../../../../../utils/media-query';

import { AccuracyIcon, ActivityIcon, AddressIcon, BatteryIcon, ChargingLevelIcon, SpeedIcon, TimeIcon } from '../../../../../constants/app-icons'

import './track-map-info-window.scss'

const TrackMapInfoWindow = ({ locationRecord, addresses, externalDatasheet }) => {
    const { isXSmall, isSmall } = useScreenSize();

    const activityTypeDescription = AppConstants.motionActivityTypeDictionary.find(activity => activity.id === locationRecord.motionActivityTypeId);

    const dataSheet = useMemo(() => {
        return externalDatasheet ?? [
            {
                id: 1,
                iconRender: (props) => <TimeIcon { ...props }/>,
                description: 'Время:',
                value: new Date(locationRecord.mobileDeviceDateTime).toLocaleString('ru-RU')
            },
            {
                id: 2,
                iconRender: (props) => <AccuracyIcon { ...props }/>,
                description: 'Точность:',
                value: `${ locationRecord.accuracy } м`
            },
            {
                id: 3,
                iconRender: (props) => <ActivityIcon { ...props }/>,
                description: 'Активность:',
                value: activityTypeDescription ? activityTypeDescription.description : locationRecord.motionActivityTypeId
            },
            {
                id: 4,
                iconRender: (props) => <SpeedIcon { ...props }/>,
                description: 'Скорость:',
                value: locationRecord.speed < 0 ? '-' : `${ Math.floor(locationRecord.speed * 3.6 * 100) / 100 } км/ч`
            },
            {
                id: 5,
                iconRender: (props) => <ChargingLevelIcon { ...props }/>,
                description: 'Уровень заряда:',
                value: `${ Math.floor(locationRecord.batteryLevel * 100 * 100) / 100 } %`
            },
            {
                id: 6,
                iconRender: (props) => <BatteryIcon { ...props }/>,
                description: 'На зарядке:',
                value: locationRecord.isCharging ? 'Да' : 'Нет'
            }
        ];
    }, [activityTypeDescription, externalDatasheet, locationRecord.accuracy, locationRecord.batteryLevel, locationRecord.isCharging, locationRecord.mobileDeviceDateTime, locationRecord.motionActivityTypeId, locationRecord.speed]);

    return (
        <table className={ 'simple-grid track-map-info-window-grid' } style={ isXSmall ? { fontSize: 10 } : ( isSmall ? { fontSize: 11 } : {} ) }>
            { addresses !== null && addresses.length > 0 ? (
                    <thead>
                    <tr>
                        <td colSpan={ 2 }>
                            <div className={ 'track-map-info-window-data-row' }>
                                <AddressIcon size={ 18 }/>
                                <div style={ { display: 'grid', gap: 3 } }>
                                    { addresses.map((a, i) => (
                                        <div key={ i } style={ { fontWeight: 500 } }>{ a ?? AppConstants.noDataLongText }</div>
                                    )) }
                                </div>
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
