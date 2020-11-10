import React from 'react';
import CheckBox from 'devextreme-react/ui/check-box';
import SelectBox from 'devextreme-react/ui/select-box';
import { MdTimer, MdTimerOff } from 'react-icons/all';


const TrackMapHeader = ({ timeline, currentTimelineItemId, onTrackTypeChanged, onIntervalChanged }) => {

    if (!timeline) {
        return null;
    }

    const currentIndex = timeline.findIndex(t => t.id === currentTimelineItemId);
    const dataSource = timeline.map(item => {
        const timeFormat = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const beginDate = new Date(Date.parse(item.beginDate));
        const endDate = new Date(Date.parse(item.endDate));
        endDate.setTime(endDate.getTime() - 1000);
        return { ...item, ...{ text: `${ beginDate.toLocaleTimeString('ru-RU', timeFormat) } - ${ endDate.toLocaleTimeString('ru-RU', timeFormat) }` } }
    });

    return (
        <>
            <div className={ 'track-map-header' }>
                <div style={ { flex: 4 } }>
                    <CheckBox className={ 'track-map-check-box' } text={ 'Показывать маркерами геолокации' }
                              onValueChanged={ onTrackTypeChanged }/>
                </div>
                { timeline ?
                    (
                        <div style={ { flex: 1 } }>
                            <SelectBox
                                dataSource={ dataSource }
                                defaultValue={ timeline[currentIndex].id }
                                selectedItem={ timeline[currentIndex] }
                                className={ 'track-map-select-box' }
                                valueExpr={ 'id' }
                                displayExpr={ 'text' }
                                onValueChanged={ onIntervalChanged }
                                itemRender={ (timelineItem) => {
                                    const timeFormat = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
                                    const beginDate = new Date(Date.parse(timelineItem.beginDate));
                                    const endDate = new Date(Date.parse(timelineItem.endDate));
                                    endDate.setTime(endDate.getTime() - 1000);

                                    return (
                                        <>
                                            <div style={ { display: 'flex', width: 200, fontSize: 14, } }>
                                                <div style={ { display: 'flex', marginRight: 10, flex: 1, alignItems: 'center' } }
                                                     className={ 'track-map-info-box-item' }>
                                                    <MdTimer size={ 18 }/>
                                                    <div style={ { marginLeft: 5 } }>c { beginDate.toLocaleTimeString('ru-RU', timeFormat) }</div>
                                                </div>
                                                <div style={ { display: 'flex', flex: 1, alignItems: 'center' } } className={ 'track-map-info-box-item' }>
                                                    <MdTimerOff size={ 18 }/>
                                                    <div style={ { marginLeft: 5 } }>до { endDate.toLocaleTimeString('ru-RU', timeFormat) }</div>
                                                </div>
                                            </div>
                                        </>
                                    );
                                } }/>
                        </div>
                    ) : null }
            </div>
        </>
    );
};

export default TrackMapHeader;