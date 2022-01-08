import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import {
    FitToMapIcon,
    RefreshIcon,
    WorkDateIcon,
    StationaryZoneOnIcon,
    StationaryZoneOffIcon,
    TrackMapSettingsOffIcon,
    TrackMapSettingsOnIcon, TrackMapZoneOffIcon, TrackMapZoneOnIcon, TimelineOnIcon, TimelineOffIcon, WorkDateTodayIcon
} from '../../../../constants/app-icons';
import ContextMenuItem from '../../../context-menu-item/context-menu-item';
import { useScreenSize } from '../../../../utils/media-query';
import { useTrackMapSettingsContext } from '../track-map-contexts/track-map-settings-context';
import { useAppSettings } from '../../../../contexts/app-settings';
import { ContextMenuProps } from '../../../../models/context-menu-props';
import { AppSettingsContextModel } from '../../../../models/app-settings-context';
import { TrackMapSettingsContextModel } from '../../../../models/track-map-settings-context';
import { ContextMenuItemItemModel } from '../../../../models/context-menu-item-props';
import { ItemContextMenuEvent } from 'devextreme/ui/context_menu';

const TrackMapPopupMenu = ({ innerRef, initialDate, commands }: (ContextMenuProps & { initialDate?: Date}) ) => {

    const { setWorkDateToday }: AppSettingsContextModel = useAppSettings();

    const {
        isShowTrackMapSettings, setIsShowTrackMapSettings,
        isShowTrackMapZones, setIsShowTrackMapZones,
        isShowStationaryZone, setIsShowStationaryZone,
        isShowTrackMapTimeline, setIsShowTrackMapTimeline
    }: TrackMapSettingsContextModel = useTrackMapSettingsContext();

    const { isXSmall } = useScreenSize();

    const items = useMemo(() => {
        let items: ContextMenuItemItemModel[] = [
            {
                name: 'refresh',
                text: 'Обновить',
                renderIconItem: () => <RefreshIcon size={ 18 }/>,
                onClick: async (e: ItemContextMenuEvent) => {
                    await e.component.hide();
                    commands.refresh();
                },
            },
            {
                name: 'workDateToday',
                text: 'Сегодня',
                renderIconItem: () => <WorkDateTodayIcon size={ 18 }/>,
                onClick: async (e: ItemContextMenuEvent) => {
                    await e.component.hide();
                    setWorkDateToday();
                }
            },
            {
                name: 'workDate',
                text: 'Рабочая дата',
                renderIconItem: () => <WorkDateIcon size={ 18 }/>,
                onClick: async (e: ItemContextMenuEvent) => {
                    await e.component.hide();
                    commands.showWorkDatePicker();
                }
            },
            {
                name: 'fitToMap',
                text: 'По размеру',
                renderIconItem: () => <FitToMapIcon size={ 18 }/>,
                onClick: async (e: ItemContextMenuEvent) => {
                    await e.component.hide();
                    commands.fitToMap();
                },
            },
            {
                name: 'showStationaryZones',
                text: isShowStationaryZone ? 'Скрывать зоны' : 'Показывать зоны',
                renderIconItem: () => ( isShowStationaryZone ? <StationaryZoneOffIcon size={ 18 }/> : <StationaryZoneOnIcon size={ 18 }/> ),
                onClick: async (e: ItemContextMenuEvent) => {
                    await e.component.hide();
                    setIsShowStationaryZone(prev => !prev );
                }
            }
        ];
        items = !isXSmall ? [...items,
             {
                name: 'showTrackMapSettings',
                text: isShowTrackMapSettings ? 'Скрыть настройки' : 'Показать настройки',
                renderIconItem: () => ( isShowTrackMapSettings ? <TrackMapSettingsOffIcon size={ 18 }/> :
                    <TrackMapSettingsOnIcon size={ 18 }/> ),
                onClick: async (e: ItemContextMenuEvent) => {
                    await e.component.hide();
                    setIsShowTrackMapZones(false);
                    setIsShowTrackMapTimeline(false);
                    setIsShowTrackMapSettings(prev => !prev);
                }
            },
            {
                name: 'showTrackMapZones',
                text: isShowTrackMapZones ? 'Скрыть список зон' : 'Показать список зон',
                renderIconItem: () => ( isShowTrackMapZones ? <TrackMapZoneOffIcon size={ 18 }/> :
                    <TrackMapZoneOnIcon size={ 18 }/> ),
                onClick: async (e: ItemContextMenuEvent) => {
                    await e.component.hide();
                    setIsShowTrackMapSettings(false);
                    setIsShowTrackMapTimeline(false);
                    setIsShowTrackMapZones(prev => !prev);
                }
            },
            {
                name: 'showTrackMapTimeline',
                text: isShowTrackMapTimeline ? 'Скрыть хронологию' : 'Показать хронологию',
                renderIconItem: () => ( isShowTrackMapTimeline ? <TimelineOffIcon size={ 18 }/> :
                    <TimelineOnIcon size={ 18 }/> ),
                onClick: async (e: ItemContextMenuEvent) => {
                    await e.component.hide();
                    setIsShowTrackMapSettings(false);
                    setIsShowTrackMapZones(false);
                    setIsShowTrackMapTimeline(prev => !prev);
                }
            }
        ] : items;


        return items;
    }, [commands, isShowStationaryZone, isShowTrackMapSettings, isShowTrackMapTimeline, isShowTrackMapZones, isXSmall, setIsShowStationaryZone, setIsShowTrackMapSettings, setIsShowTrackMapTimeline, setIsShowTrackMapZones, setWorkDateToday]);

    return <ContextMenu
        ref={ innerRef }
        itemRender={ (item) => <ContextMenuItem item={ item } /> }
        showEvent={ 'suppress' }
        items={ items.filter(i => !initialDate || i.name !== 'workDate' ) }
        position={ { my: 'right top', at: 'right bottom' } }
    />
}

export default React.forwardRef<any, (ContextMenuProps & { initialDate?: any})>((props, ref) =>
  <TrackMapPopupMenu  { ...props } innerRef={ ref } />
);
