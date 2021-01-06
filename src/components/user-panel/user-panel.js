import React, { useMemo } from 'react';
import ContextMenu, { Position } from 'devextreme-react/context-menu';
import List from 'devextreme-react/list';
import { useAuth } from '../../contexts/auth';
import { useAppSettings } from '../../contexts/app-settings';
import { useSharedArea } from '../../contexts/shared-area';
import { useNavigation } from '../../contexts/navigation';
import { ExitIcon, RefreshIcon, UserIcon, WorkDateIcon } from '../../utils/app-icons';
import ContextMenuItem from '../context-menu-item/context-menu-item';

import './user-panel.scss';

export default function ({ menuMode }) {
    const { user } = useAuth();
    const { appSettingsData, setAppSettingsData } = useAppSettings();
    const { showWorkDatePicker, signOutWithConfirm } = useSharedArea();
    const { navigationData } = useNavigation();

    const menuItems = useMemo(() => {
        const items = [
            {
                text: user.email,
                renderIconItem: () => <UserIcon size={ 24 }/>,
                renderTextItem: (item) => {
                    return (
                        <>

                            <span style={ {
                                width: 150,
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                display: 'inline-block',
                                verticalAlign: 'middle'
                            } } className="dx-menu-item-text">{ item.text }</span>
                        </>
                    )
                }
            },
            {
                text: 'Рабочая дата',
                renderIconItem: () => <WorkDateIcon size={ 18 }/>,
                onClick: () => {
                    showWorkDatePicker();
                }
            },
            {
                text: 'Выход',
                renderIconItem: () => <ExitIcon size={ 18 }/>,
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
                renderIconItem: () => <RefreshIcon size={ 18 }/>,
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
                    itemRender={ (item) => <ContextMenuItem item={ item } /> }
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
                    itemRender={ (item) => <ContextMenuItem item={ item } /> }
                    items={ menuItems }
                />
            ) }
        </div>
    );
}
