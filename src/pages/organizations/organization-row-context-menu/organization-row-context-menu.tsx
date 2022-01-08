import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import { DeleteIcon, EditIcon } from '../../../constants/app-icons';
import ContextMenuItem from '../../../components/context-menu-item/context-menu-item';
import { ContextMenuProps } from '../../../models/context-menu-props';
import { ContextMenuItemItemModel } from '../../../models/context-menu-item-props';
import { ItemContextMenuEvent } from 'devextreme/ui/context_menu';

const OrganizationRowContextMenu = ({ innerRef, commands }: ContextMenuProps) => {

    const items = useMemo(() => {
        return [{
            text: 'Редактировать...',
            renderIconItem: () => <EditIcon size={ 18 } />,
            onClick: async (e: ItemContextMenuEvent) => {
                await e.component.hide();
                if (commands.editOffice) {
                    await commands.editOffice();
                }
            }
        }, {
            text: 'Удалить...',
            renderIconItem: () => <DeleteIcon size={ 18 } />,
            onClick: async (e: ItemContextMenuEvent) => {
                await e.component.hide();
                if (commands.deleteOffice) {
                    await commands.deleteOffice();
                }
            }
        }]  as ContextMenuItemItemModel[];
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

export default React.forwardRef<any, ContextMenuProps>((props, ref) =>
  <OrganizationRowContextMenu { ...props } innerRef={ ref } />
);

