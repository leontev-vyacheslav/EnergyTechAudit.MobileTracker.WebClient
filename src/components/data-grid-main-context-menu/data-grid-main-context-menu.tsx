import React, { ReactNode, useMemo } from 'react';
import { AddIcon, ExportToXlsxIcon, RefreshIcon } from '../../constants/app-icons';
import ContextMenu from 'devextreme-react/context-menu';
import ContextMenuItem from '../context-menu-item/context-menu-item';
import { ContextMenuProps } from '../../models/context-menu-props';

export type ContextMenuItemItemModel = {
    name?: string,
    text: string,
    renderIconItem: (item: ContextMenuItemItemModel) => ReactNode,
    renderTextItem?: (item: ContextMenuItemItemModel) => ReactNode,
    onClick: (e: any) => void
}

export type ContextMenuItemProps = {
    item: ContextMenuItemItemModel
}

const DataGridMainContextMenu = ({ innerRef, commands }: ContextMenuProps) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Обновить...',
                renderIconItem: () => <RefreshIcon size={ 18 }/>,
                onClick: async (e: any) => {
                    e.component.hide();
                    if(commands.refresh) {
                        await commands.refresh();
                    }
                }
            },
            {
                text: 'Добавить...',
                renderIconItem: () => <AddIcon size={ 18 }/>,
                onClick: (e: any) => {
                    e.component.hide();
                    if(commands.add) {
                        commands.add();
                    }
                }
            },
            {
                text: 'Экспорт в XLSX...',
                renderIconItem: () => <ExportToXlsxIcon size={ 18 }/>,
                onClick: async (e: any) => {
                    e.component.hide();
                    if(commands.exportToXlsx) {
                        await commands.exportToXlsx();
                    }
                }
            }] as ContextMenuItemItemModel[];
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
  <DataGridMainContextMenu { ...props } innerRef={ ref }/>
);
