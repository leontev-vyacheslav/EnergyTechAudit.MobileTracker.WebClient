import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import { DeleteIcon, EditIcon, OfficeIcon } from '../../../constants/app-icons';
import ContextMenuItem from '../../../components/context-menu-item/context-menu-item';

const OrganizationGroupRowContextMenu = ({ innerRef, commands }) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Редактировать...',
                renderIconItem: () => <EditIcon size={ 18 }/>,
                onClick: async (e) => {
                    e.component.hide();
                    if (commands.editOrganization) {
                        await commands.editOrganization();
                    }
                }
            },
            {
                text: 'Удалить...',
                renderIconItem: () => <DeleteIcon size={ 18 }/>,
                onClick: async (e) => {
                    e.component.hide();
                    if (commands.deleteOrganization) {
                        await commands.deleteOrganization();
                    }
                }
            },
            {
                text: 'Добавить офис...',
                renderIconItem: () => <OfficeIcon size={ 18 }/>,
                onClick: async (e) => {
                    e.component.hide();
                    if (commands.addOffice) {
                        await commands.addOffice();
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

export default React.forwardRef((props, ref) => <OrganizationGroupRowContextMenu
    innerRef={ ref } { ...props }
/>);

