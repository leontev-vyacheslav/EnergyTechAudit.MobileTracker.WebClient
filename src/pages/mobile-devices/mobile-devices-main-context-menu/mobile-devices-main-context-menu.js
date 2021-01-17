import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';

import {  RefreshIcon } from '../../../constants/app-icons';
import ContextMenuItem from '../../../components/context-menu-item/context-menu-item';

const MobileDevicesMainContextMenu = ({ innerRef, commands }) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Обновить...',
                renderIconItem: () => <RefreshIcon size={ 18 }/>,
                onClick: (e) => {
                    e.component.hide();
                    if(commands.refresh) {
                        commands.refresh();
                    }
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

export default React.forwardRef((props, ref) => <MobileDevicesMainContextMenu
    innerRef={ ref } { ...props }
/>);

