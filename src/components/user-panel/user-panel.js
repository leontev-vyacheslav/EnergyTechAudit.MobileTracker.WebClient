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

    function ItemTemplate (e) {
        return (
            <React.Fragment>
                <span className={ `dx-icon dx-icon-${ e.icon } ${ menuMode === 'list' ? ' dx-list-item-icon' : '' }` }/>
                { e.renderItem ? e.renderItem() : e.text }
            </React.Fragment>
        );
    }

    const menuItems = useMemo(() => {

        let items = [
            {
                icon: 'user',
                text: user.email,
                renderItem: () => {
                    return ( <span style={ {
                        width: 150,
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        display: 'inline-block',
                        verticalAlign: 'middle'
                    } }>{ user.email }</span> );
                }
            },
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

        if (navigationData.currentPath === '/mobile-devices') {
            items.splice(1, 0, {
                text: 'Обновить',
                icon: 'refresh',
                onClick: () => {
                    setAppSettingsData({ ...appSettingsData, ...{ workDate: appSettingsData.workDate } });
                }
            })
        }
        return items;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigationData.currentPath, showWorkDatePicker, signOutWithConfirm]);

    return (

        <div className={ 'user-panel' }>
            { menuMode === 'context' && (
                    <div className={ 'user-info' }>
                        <div className={ 'image-container' }>
                            <div className={ 'dx-icon dx-icon-overflow' }/>
                        </div>
                    </div>
                )
            }
            { menuMode === 'context' && (
                <ContextMenu
                    itemRender={ ItemTemplate }
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
                <List
                    className={ 'dx-toolbar-menu-action' }
                    itemRender={ ItemTemplate }
                    items={ menuItems }
                />
            ) }
        </div>
    );
}
