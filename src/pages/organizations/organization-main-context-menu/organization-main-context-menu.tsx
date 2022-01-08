import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';

import { AddOrganizationIcon, ExportToXlsxIcon, RefreshIcon } from '../../../constants/app-icons';
import ContextMenuItem from '../../../components/context-menu-item/context-menu-item';
import { ContextMenuProps } from '../../../models/context-menu-props';
import { ContextMenuItemItemModel } from '../../../models/context-menu-item-props';
import { ItemContextMenuEvent } from 'devextreme/ui/context_menu';

const OrganizationMainContextMenu = ({ innerRef, commands }: ContextMenuProps) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Обновить...',
                renderIconItem: () => <RefreshIcon size={ 18 }/>,
                onClick: async (e: ItemContextMenuEvent) => {
                    await e.component.hide();
                    if(commands.refreshAsync) {
                        await commands.refreshAsync();
                    }
                }
            },
            {
                text: 'Добавить...',
                renderIconItem: () => <AddOrganizationIcon size={ 18 }/>,
                onClick: async (e: ItemContextMenuEvent) => {
                    await e.component.hide();
                    if(commands.addOrganization) {
                        commands.addOrganization();
                    }
                }
            },
            {
                text: 'Экспорт в XLSX...',
                renderIconItem: () => <ExportToXlsxIcon size={ 18 }/>,
                onClick: async (e: ItemContextMenuEvent) => {
                    await e.component.hide();
                    if(commands.exportToXlsx) {
                        await commands.exportToXlsx();
                    }
                }
            }]  as ContextMenuItemItemModel[];
    }, [commands]);

    return <ContextMenu
        ref={ innerRef }
        closeOnOutsideClick={ true }
        itemRender={ (item) => <ContextMenuItem item={ item } /> }
        showEvent={ 'suppress' }
        items={ items }
        position={ { my: 'left top', at: 'left bottom' } }
    />
}

export default React.forwardRef<any, ContextMenuProps>((props, ref) =>
  <OrganizationMainContextMenu { ...props } innerRef={ ref } />
);

