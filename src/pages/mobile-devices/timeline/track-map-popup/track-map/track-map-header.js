import React, { useMemo } from 'react';
import SelectBox from 'devextreme-react/ui/select-box';
import { MdTimer, MdTimerOff } from 'react-icons/all';
import './track-map-header.scss';
import { useScreenSize } from '../../../../../utils/media-query';

const TrackMapHeader = ({ timeline, currentTimelineItem, onIntervalChanged }) => {

    const { isXSmall } = useScreenSize();

    const currentIndex = useMemo(() => {
        let ind = timeline.findIndex(t => t.id === currentTimelineItem.id);
        return ind !== -1 ? ind : 0;
    }, [currentTimelineItem.id, timeline])

    const dataSource = useMemo(() => timeline.map(item => {
        const beginDate = new Date(Date.parse(item.beginDate));
        const endDate = new Date(Date.parse(item.endDate));
        endDate.setTime(endDate.getTime() - 1);
        return {
            id: item.id,
            beginDate: item.beginDate,
            endDate: item.endDate,
            text: `${ beginDate.toLocaleTimeString('ru-RU') } - ${ endDate.toLocaleTimeString('ru-RU') }`
        };
    }), [timeline]);

    return (

        <div className={ 'track-map-header' }>
            <div className={ 'track-map-select-box-container' } style={ { width: !isXSmall ? '300px' : '100%' } }>
                <SelectBox
                    dataSource={ dataSource }
                    defaultValue={ timeline[currentIndex].id }
                    selectedItem={ timeline[currentIndex] }
                    className={ 'track-map-select-box' }
                    valueExpr={ 'id' }
                    displayExpr={ 'text' }
                    onValueChanged={ onIntervalChanged }
                    itemRender={ (timelineItem) => {
                        const beginDate = new Date(Date.parse(timelineItem.beginDate));
                        const endDate = new Date(Date.parse(timelineItem.endDate));
                        endDate.setTime(endDate.getTime() - 1000);

                        return (
                            <>
                                <div style={ { display: 'flex', width: 200, fontSize: 14, } }>
                                    <div style={ { display: 'flex', marginRight: 10, flex: 1, alignItems: 'center' } }
                                         className={ 'track-map-info-box-item' }>
                                        <MdTimer size={ 18 }/>
                                        <div style={ { marginLeft: 5 } }>c { beginDate.toLocaleTimeString('ru-RU') }</div>
                                    </div>
                                    <div style={ { display: 'flex', flex: 1, alignItems: 'center' } } className={ 'track-map-info-box-item' }>
                                        <MdTimerOff size={ 18 }/>
                                        <div style={ { marginLeft: 5 } }>до { endDate.toLocaleTimeString('ru-RU') }</div>
                                    </div>
                                </div>
                            </>
                        );
                    } }/>
            </div>
        </div>
    );
};

export default TrackMapHeader;
