import React, { useMemo } from 'react';
import { DeleteIcon, EditIcon } from '../../constants/app-icons';
import ContextMenu from 'devextreme-react/context-menu';
import ContextMenuItem from '../context-menu-item/context-menu-item';

const DataGridRowContextMenu = ({ innerRef, commands }) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Редактировать...',
                renderIconItem: () => <EditIcon size={ 18 }/>,
                onClick: async (e) => {
                    e.component.hide();
                    if (commands.edit) {
                        await commands.edit();
                    }
                }
            },
            {
                text: 'Удалить...',
                renderIconItem: () => <DeleteIcon size={ 18 }/>,
                onClick: async (e) => {
                    e.component.hide();
                    if (commands.remove) {
                        await commands.remove();
                    }
                }
            }];
    }, [commands]);

    return <ContextMenu
        ref={ innerRef }
        closeOnOutsideClick={ true }
        itemRender={ (item) => <ContextMenuItem item={ item }/> }
        showEvent={ 'suppress' }
        items={ items }
        position={ { my: 'top left', at: 'bottom left' } }
    />
}

export default React.forwardRef((props, ref) => <DataGridRowContextMenu
    innerRef={ ref } { ...props }
/>);
