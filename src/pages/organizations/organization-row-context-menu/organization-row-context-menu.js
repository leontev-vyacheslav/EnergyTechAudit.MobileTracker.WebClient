import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import { DeleteIcon, EditIcon } from '../../../constants/app-icons';
import ContextMenuItem from '../../../components/context-menu-item/context-menu-item';

const OrganizationRowContextMenu = ({ innerRef, commands }) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Редактировать...',
                renderIconItem: () => <EditIcon size={ 18 }/>,
                onClick: async (e) => {
                    e.component.hide();
                    if (commands.editOffice) {
                        await commands.editOffice();
                    }
                }
            },
            {
                text: 'Удалить...',
                renderIconItem: () => <DeleteIcon size={ 18 }/>,
                onClick: async (e) => {
                    e.component.hide();
                    if (commands.deleteOffice) {
                        await commands.deleteOffice();
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

export default React.forwardRef((props, ref) => <OrganizationRowContextMenu
    innerRef={ ref } { ...props }
/>);

