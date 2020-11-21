import React, { useMemo } from 'react';
import ContextMenu, { Position } from 'devextreme-react/context-menu';
import List from 'devextreme-react/list';
import { useAuth } from '../../contexts/auth';
import { useAppSettings } from '../../contexts/app-settings';
import { useSharedArea } from '../../contexts/shared-area';
import { confirm } from 'devextreme/ui/dialog';

import './user-panel.scss';

export default function ({ menuMode }) {
    const { user, signOut } = useAuth();
    const { appSettingsData, setAppSettingsData } = useAppSettings();
    const { workDatePickerRef } = useSharedArea();

    const menuItems = useMemo(() => ( [
        {
            text: 'Обновить',
            icon: 'refresh',
            onClick: () => {
                setAppSettingsData({ ...appSettingsData, ...{ workDate: appSettingsData.workDate } });
            }
        },
        {
            text: 'Рабочая дата',
            icon: 'event',
            onClick: () => {
                if (workDatePickerRef.current) {
                    workDatePickerRef.current.instance.open();
                }
            }
        },
        {
            text: 'Выход',
            icon: 'runner',
            onClick: () =>
            {
                const result = confirm('<div style="display: flex; align-items: center"><i class="dx-icon dx-icon-runner" style="font-size: 3em"></i><span>Действительно <b>выйти</b> из приложения!</span></div>', 'Выход');
                result.then((dialogResult) => {
                    if(dialogResult) {
                        signOut();
                    }
                });
            }
        },
    ] ), [signOut, workDatePickerRef]);

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
