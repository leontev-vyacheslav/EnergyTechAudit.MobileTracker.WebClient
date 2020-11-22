import React, { useMemo } from 'react';
import ContextMenu, { Position } from 'devextreme-react/context-menu';
import List from 'devextreme-react/list';
import { useAuth } from '../../contexts/auth';
import { useAppSettings } from '../../contexts/app-settings';
import { useSharedArea } from '../../contexts/shared-area';
import { useNavigation } from '../../contexts/navigation';

import './user-panel.scss';

export default function ({ menuMode }) {
    const { user } = useAuth();
    const { appSettingsData, setAppSettingsData } = useAppSettings();
    const { showWorkDatePicker, signOutWithConfirm } = useSharedArea();
    const { navigationData } = useNavigation();

    const menuItems = useMemo(() => {
        let items = [
            {
                text: 'Рабочая дата',
                icon: 'event',
                onClick: () => {
                    showWorkDatePicker();
                }
            },
            {
                text: 'Выход',
                icon: 'runner',
                onClick: () => {
                    signOutWithConfirm();
                }
            },
        ];
        if (navigationData.currentPath === '/mobileDevices') {
            items = [
                {
                    text: 'Обновить',
                    icon: 'refresh',
                    onClick: () => {
                        setAppSettingsData({ ...appSettingsData, ...{ workDate: appSettingsData.workDate } });
                    }
                },
                ...items]
        }
        return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigationData.currentPath, showWorkDatePicker, signOutWithConfirm]);

    return (
        <div className={ 'user-panel' }>
            <div className={ 'user-info' }>
                <div className={ 'image-container' }>
                    <div className={ 'dx-icon dx-icon-user' }/>
                </div>
                <div style={ { display: 'flex', flexDirection: 'column', marginLeft: 10, lineHeight: 'initial', alignItems: 'center' } }>
                    <div className={ 'user-name' }>{ user.userName }</div>
                    <div>{ new Date(appSettingsData.workDate).toLocaleDateString('ru-RU') }</div>
                </div>
            </div>

            { menuMode === 'context' && (
                <ContextMenu
                    items={ menuItems }
                    target={ '.user-button' }
                    showEvent={ 'dxclick' }
                    width={ 200 }
                    cssClass={ 'user-menu' }
                >
                    <Position my={ 'top right' } at={ 'bottom right' }/>
                </ContextMenu>
            ) }
            { menuMode === 'list' && (
                <List className={ 'dx-toolbar-menu-action' } items={ menuItems }/>
            ) }
        </div>
    );
}
