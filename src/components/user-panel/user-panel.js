import React, { useMemo } from 'react';
import ContextMenu, { Position } from 'devextreme-react/context-menu';
import List from 'devextreme-react/list';
import { useAuth } from '../../contexts/auth';
import './user-panel.scss';

export default function ({ menuMode }) {
    const { user, signOut } = useAuth();

    const menuItems = useMemo(() => ( [
        {
            text: 'Выход',
            icon: 'runner',
            onClick: signOut
        }
    ] ), [signOut]);

    return (
        <div className={ 'user-panel' }>
            <div className={ 'user-info' }>
                <div className={ 'image-container' }>
                    <div className={ 'dx-icon dx-icon-user' }/>
                </div>
                <div className={ 'user-name' }>{ user.userName }</div>
            </div>

            { menuMode === 'context' && (
                <ContextMenu
                    items={ menuItems }
                    target={ '.user-button' }
                    showEvent={ 'dxclick' }
                    width={ 250 }
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
