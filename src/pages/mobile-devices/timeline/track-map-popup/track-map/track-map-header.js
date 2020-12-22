import React, { useEffect, useMemo, useState } from 'react';
import SelectBox from 'devextreme-react/ui/select-box';
import { MdPerson, MdTimer, MdTimerOff } from 'react-icons/all';
import { useScreenSize } from '../../../../../utils/media-query';

import './track-map-header.scss';
import { useAppData } from '../../../../../contexts/app-data';
import { useAppSettings } from '../../../../../contexts/app-settings';

const TrackMapHeader = ({ mobileDevice, timelineItem, initialDate, onCurrentTimelineItemChanged }) => {
    const { isXSmall } = useScreenSize();

    const { appSettingsData, getDailyTimelineItem } = useAppSettings();
    const { getTimelinesAsync } = useAppData();

    const [currentTimeline, setCurrentTimeline] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        ( async () => {
            const timelineItem = getDailyTimelineItem(initialDate);
            let timeline = await getTimelinesAsync(mobileDevice.id, initialDate ?? appSettingsData.workDate) ?? [];
            setCurrentTimeline([timelineItem, ...timeline]);
        } )();
    }, [getTimelinesAsync, mobileDevice.id, getDailyTimelineItem, initialDate, appSettingsData.workDate]);

    useEffect(() =>{
        let index = currentTimeline.findIndex(t => t.id === timelineItem.id);
        setCurrentIndex(index);
    }, [currentTimeline, timelineItem.id, appSettingsData.workDate])

    const dataSource = useMemo(() => currentTimeline.map(item => {
        const beginDate = item.beginDate;
        const endDate = item.endDate;
        endDate.setTime(endDate.getTime() - 1000);
        return {
            id: item.id,
            beginDate: item.beginDate,
            endDate: item.endDate,
            text: `${ beginDate.toLocaleTimeString('ru-RU') } - ${ endDate.toLocaleTimeString('ru-RU') }`
        };
    }), [currentTimeline]);

    return (
        <div className={ 'track-map-header' }>
            <div className={ 'track-map-header-email' } style={ { display: !isXSmall ? 'flex' : 'none', alignItems: 'center' } }>
                <MdPerson size={ 26 }/>
                <div>{ mobileDevice.email.toLowerCase() }</div>
            </div>
            <div className={ 'track-map-select-box-container' } style={ { width: !isXSmall ? '300px' : '100%' } }>
                { dataSource && currentIndex !== -1 && dataSource[currentIndex] ? (
                    <SelectBox
                        dataSource={ dataSource }
                        value={ dataSource[currentIndex].id }
                        selectedItem={ dataSource[currentIndex] }
                        className={ 'track-map-header-select-box' }
                        valueExpr={ 'id' }
                        displayExpr={ 'text' }
                        onValueChanged={ (e) => {
                            const timelineItemId = e.value;
                            const timelineItem = currentTimeline.find(t => t.id === timelineItemId);
                            onCurrentTimelineItemChanged(timelineItem);
                        } }
                        itemRender={ (timelineItem) => {
                            return (
                                <>
                                    <div style={ { display: 'flex', width: 200, fontSize: 14, } }>
                                        <div style={ { display: 'flex', marginRight: 10, flex: 1, alignItems: 'center' } }
                                             className={ 'track-map-info-box-item' }>
                                            <MdTimer size={ 18 }/>
                                            <div style={ { marginLeft: 5 } }>c { timelineItem.beginDate.toLocaleTimeString('ru-RU') }</div>
                                        </div>
                                        <div style={ { display: 'flex', flex: 1, alignItems: 'center' } } className={ 'track-map-info-box-item' }>
                                            <MdTimerOff size={ 18 }/>
                                            <div style={ { marginLeft: 5 } }>до { timelineItem.endDate.toLocaleTimeString('ru-RU') }</div>
                                        </div>
                                    </div>
                                </>
                            );
                        } }/> ) : null }

            </div>
        </div>
    );
};

export default TrackMapHeader;
