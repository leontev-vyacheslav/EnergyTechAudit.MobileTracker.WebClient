import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import {
    FitToMapIcon,
    RefreshIcon,
    WorkDateIcon,
    StationaryZoneOn,
    StationaryZoneOff,
    TrackMapSettingsOffIcon,
    TrackMapSettingsOnIcon
} from '../../../../constants/app-icons';
import ContextMenuItem from '../../../context-menu-item/context-menu-item';
import { useAppSettings } from '../../../../contexts/app-settings';
import { useScreenSize } from '../../../../utils/media-query';

const TrackMapPopupMenu = ({ innerRef, initialDate, commands }) => {
    const { appSettingsData, setAppSettingsData } = useAppSettings();
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
                text: appSettingsData.isShowStationaryZone ? 'Скрывать зоны' : 'Показывать зоны',
                renderIconItem: () => ( appSettingsData.isShowStationaryZone ? <StationaryZoneOff size={ 18 }/> : <StationaryZoneOn size={ 18 }/> ),
                onClick: (e) => {
                    e.component.hide();
                    const delayTimer = setTimeout(() => {
                        setAppSettingsData({ ...appSettingsData, isShowStationaryZone: !appSettingsData.isShowStationaryZone });
                        clearTimeout(delayTimer);
                    }, 50);
                }
            }
        ];
        items = !isXSmall ? [...items,
             {
                name: 'showTrackMapSettings',
                text: appSettingsData.isShowTrackMapSettings ? 'Закрыть настройки' : 'Показать настройки',
                renderIconItem: () => ( appSettingsData.isShowTrackMapSettings ? <TrackMapSettingsOffIcon size={ 18 }/> :
                    <TrackMapSettingsOnIcon size={ 18 }/> ),
                onClick: (e) => {
                    e.component.hide();
                    const delayTimer = setTimeout(() => {
                        setAppSettingsData({ ...appSettingsData, isShowTrackMapSettings: !appSettingsData.isShowTrackMapSettings });
                        clearTimeout(delayTimer);
                    }, 50);
                }
            }
        ] : items;

        return items;
    }, [appSettingsData, commands, isXSmall, setAppSettingsData]);

    return <ContextMenu
        ref={ innerRef }
        itemRender={ (item) => <ContextMenuItem item={ item } /> }
        showEvent={ 'suppress' }
        items={ items.filter(i => !initialDate || i.name !== 'workDate' ) }
        position={ { my: 'top right', at: 'bottom right' } }
    />
}

export default React.forwardRef((props, ref) => <TrackMapPopupMenu innerRef={ ref } { ...props } />);
