import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import { DeleteIcon, EditIcon, OfficeIcon } from '../../../constants/app-icons';
import ContextMenuItem from '../../../components/context-menu-item/context-menu-item';
import { ContextMenuProps } from '../../../models/context-menu-props';
import { ContextMenuItemItemModel } from '../../../models/context-menu-item-props';
import { ItemContextMenuEvent } from 'devextreme/ui/context_menu';

const OrganizationGroupRowContextMenu = ({ innerRef, commands }: ContextMenuProps) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Редактировать...',
                renderIconItem: () => <EditIcon size={ 18 }/>,
                onClick: async (e: ItemContextMenuEvent) => {
                    await e.component.hide();
                    if (commands.editOrganization) {
                        await commands.editOrganization();
                    }
                }
            },
            {
                text: 'Удалить...',
                renderIconItem: () => <DeleteIcon size={ 18 }/>,
                onClick: async (e: ItemContextMenuEvent) => {
                    await e.component.hide();
                    if (commands.deleteOrganization) {
                        await commands.deleteOrganization();
                    }
                }
            },
            {
                text: 'Добавить офис...',
                renderIconItem: () => <OfficeIcon size={ 18 }/>,
                onClick: async (e: ItemContextMenuEvent) => {
                    await e.component.hide();
                    if (commands.addOffice) {
                        await commands.addOffice();
                    }
                }
            }] as ContextMenuItemItemModel[];
    }, [commands]);

    return <ContextMenu
        ref={ innerRef }
        closeOnOutsideClick={ true }
        itemRender={ (item) => <ContextMenuItem item={ item }/> }
        showEvent={ 'suppress' }
        items={ items }
        position={ { my: 'left top', at: 'left bottom' } }
    />
}

export default React.forwardRef<ContextMenu<ContextMenuItemItemModel>, ContextMenuProps>((props, ref) =>
  <OrganizationGroupRowContextMenu { ...props } innerRef={ ref } />
);

