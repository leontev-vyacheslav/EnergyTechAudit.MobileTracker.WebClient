import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import {
    FitToMapIcon,
    RefreshIcon,
    WorkDateIcon,
    StationaryZoneOn,
    StationaryZoneOff,
    TrackMapSettingsOffIcon,
    TrackMapSettingsOnIcon, TrackMapZoneOffIcon, TrackMapZoneOnIcon
} from '../../../../constants/app-icons';
import ContextMenuItem from '../../../context-menu-item/context-menu-item';
import { useScreenSize } from '../../../../utils/media-query';
import { useTrackMapSettingsContext } from '../track-map-settings-context';

const TrackMapPopupMenu = ({ innerRef, initialDate, commands }) => {

    const {
        isShowTrackMapSettings, setIsShowTrackMapSettings,
        isShowTrackMapZones, setIsShowTrackMapZones,
        isShowStationaryZone, setIsShowStationaryZone
    } = useTrackMapSettingsContext();


    const { isXSmall } = useScreenSize();

    const items = useMemo(() => {
        let items = [
            {
                name: 'refresh',
                text: 'Обновить',
                renderIconItem: () => <RefreshIcon size={ 18 }/>,
                onClick: (e) => {
                    e.component.hide();
                    commands.refreshToken();
                },
            }, {
                name: 'workDate',
                text: 'Рабочая дата',
                renderIconItem: () => <WorkDateIcon size={ 18 }/>,
                onClick: (e) => {
                    e.component.hide();
                    commands.showWorkDatePicker();
                }
            },
            {
                name: 'fitToMap',
                text: 'По размеру',
                renderIconItem: () => <FitToMapIcon size={ 18 }/>,
                onClick: (e) => {
                    e.component.hide();
                    commands.fitToMap();
                },
            },
            {
                name: 'showStationaryZones',
                text: isShowStationaryZone ? 'Скрывать зоны' : 'Показывать зоны',
                renderIconItem: () => ( isShowStationaryZone ? <StationaryZoneOff size={ 18 }/> : <StationaryZoneOn size={ 18 }/> ),
                onClick: (e) => {
                    e.component.hide();
                    const delayTimer = setTimeout(() => {
                        setIsShowStationaryZone(prev => !prev );
                        clearTimeout(delayTimer);
                    }, 50);
                }
            }
        ];
        items = !isXSmall ? [...items,
             {
                name: 'showTrackMapSettings',
                text: isShowTrackMapSettings ? 'Скрыть настройки' : 'Показать настройки',
                renderIconItem: () => ( isShowTrackMapSettings ? <TrackMapSettingsOffIcon size={ 18 }/> :
                    <TrackMapSettingsOnIcon size={ 18 }/> ),
                onClick: (e) => {
                    e.component.hide();
                    const delayTimer = setTimeout(() => {
                        setIsShowTrackMapZones(false);
                        setIsShowTrackMapSettings(prev => !prev);
                        clearTimeout(delayTimer);
                    }, 50);
                }
            },
            {
                name: 'showTrackMapZones',
                text: isShowTrackMapZones ? 'Скрыть список зон' : 'Показать список зон',
                renderIconItem: () => ( isShowTrackMapZones ? <TrackMapZoneOffIcon size={ 18 }/> :
                    <TrackMapZoneOnIcon size={ 18 }/> ),
                onClick: (e) => {
                    e.component.hide();
                    const delayTimer = setTimeout(() => {
                        setIsShowTrackMapSettings(false);
                        setIsShowTrackMapZones(prev => !prev);
                        clearTimeout(delayTimer);
                    }, 50);
                }
            }
        ] : items;


        return items;
    }, [commands, isXSmall, isShowStationaryZone, isShowTrackMapSettings, isShowTrackMapZones,  setIsShowStationaryZone, setIsShowTrackMapSettings, setIsShowTrackMapZones]);

    return <ContextMenu
        ref={ innerRef }
        itemRender={ (item) => <ContextMenuItem item={ item } /> }
        showEvent={ 'suppress' }
        items={ items.filter(i => !initialDate || i.name !== 'workDate' ) }
        position={ { my: 'top right', at: 'bottom right' } }
    />
}

export default React.forwardRef((props, ref) => <TrackMapPopupMenu innerRef={ ref } { ...props } />);
