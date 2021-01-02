import React, { useMemo } from 'react';
import ContextMenu, { Position } from 'devextreme-react/context-menu';
import List from 'devextreme-react/list';
import { useAuth } from '../../contexts/auth';
import { useAppSettings } from '../../contexts/app-settings';
import { useSharedArea } from '../../contexts/shared-area';
import { useNavigation } from '../../contexts/navigation';
import { UserIcon } from '../../utils/app-icons';

import './user-panel.scss';

export default function ({ menuMode }) {
    const { user } = useAuth();
    const { appSettingsData, setAppSettingsData } = useAppSettings();
    const { showWorkDatePicker, signOutWithConfirm } = useSharedArea();
    const { navigationData } = useNavigation();

    function ItemTemplate (e) {
        return (
            <>
                { e.renderItem ? e.renderItem(e) : (
                    <>
                        <i style={ { marginRight: 24 } } className={ `dx-icon dx-icon-${ e.icon } ${ menuMode === 'list' ? ' dx-list-item-icon' : '' }` }/>
                        <span className="dx-menu-item-text">{ e.text }</span>
                    </>
                ) }
            </>
        );
    }

    const menuItems = useMemo(() => {
        let items = [
            {
                icon: 'user',
                text: user.email,
                renderItem: (e) => {
                    return (
                        <>
                            <i style={ { marginRight: 24, marginTop: 4 } } className={ 'dx-icon' }>
                                <UserIcon size={ 24 }/>
                            </i>
                            <span style={ {
                                width: 150,
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                display: 'inline-block',
                                verticalAlign: 'middle'
                            } } className="dx-menu-item-text">{ e.text }</span>
                        </>
                    )
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
        if (
            navigationData && navigationData.currentPath &&
            ( navigationData.currentPath.indexOf('/mobile-devices') !== -1 || navigationData.currentPath.indexOf('/track-sheet') !== -1 )
        ) {
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
