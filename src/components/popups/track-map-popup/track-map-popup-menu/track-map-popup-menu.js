import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import { FitToMapIcon, RefreshIcon, WorkDateIcon, StationaryZoneOn, StationaryZoneOff } from '../../../../constants/app-icons';
import ContextMenuItem from '../../../context-menu-item/context-menu-item';
import { useAppSettings } from '../../../../contexts/app-settings';

const TrackMapPopupMenu = ({ innerRef, initialDate, commands }) => {
    const { appSettingsData, setAppSettingsData } = useAppSettings();

    const items = useMemo(() => [
        {
            name: 'refresh',
            text: 'Обновить',
            renderIconItem: () => <RefreshIcon size={ 18 }/>,
            onClick: (e) => {
                e.component.hide();
                commands.refreshToken();
            },
        },{
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
            renderIconItem: () => (appSettingsData.isShowStationaryZone ? <StationaryZoneOff size={ 18 }/> : <StationaryZoneOn size={ 18 }/> ) ,
            onClick: (e) => {
                e.component.hide();
                const delayTimer =  setTimeout(() => {
                    setAppSettingsData(previous => ( { ...previous, isShowStationaryZone: !previous.isShowStationaryZone } ));
                    clearTimeout(delayTimer);
                }, 50);
            }
        },
    ], [ commands, setAppSettingsData, appSettingsData.isShowStationaryZone]);

    return <ContextMenu
        ref={ innerRef }
        itemRender={ (item) => <ContextMenuItem item={ item } /> }
        showEvent={ 'suppress' }
        items={ items.filter(i => !initialDate || i.name !== 'workDate' ) }
        position={ { my: 'top right', at: 'bottom right' } }
    />
}

export default React.forwardRef((props, ref) => <TrackMapPopupMenu innerRef={ ref } { ...props } />);
