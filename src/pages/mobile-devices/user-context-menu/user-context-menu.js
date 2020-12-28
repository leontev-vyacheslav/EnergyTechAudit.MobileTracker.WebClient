import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';

import {  UserIcon } from '../../../utils/app-icons';
import ContextMenuItem from '../../../components/context-menu-item/context-menu-item';

const UserContextMenu = ({ innerRef, commands }) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Сведения о пользователе...',
                renderItem: () => <UserIcon size={ 18 }/>,
                onClick: (e) => {
                    e.component.hide();
                    commands.showExtendedUserInfo();
                }
            }];
    }, [commands]);

    return <ContextMenu
        ref={ innerRef }
        closeOnOutsideClick={ true }
        itemRender={ (item) => <ContextMenuItem item={ item } /> }
        showEvent={ 'suppress' }
        items={ items }
        position={ { my: 'top left', at: 'bottom left' } }
    />
}

export default React.forwardRef((props, ref) => <UserContextMenu
    innerRef={ ref } { ...props }
/>);

