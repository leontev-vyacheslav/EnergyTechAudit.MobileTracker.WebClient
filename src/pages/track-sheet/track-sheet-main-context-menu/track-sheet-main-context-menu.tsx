import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import { ExportToXlsxIcon, RefreshIcon } from '../../../constants/app-icons';
import ContextMenuItem from '../../../components/context-menu-item/context-menu-item';
import { ContextMenuProps } from '../../../models/context-menu-props';
import { ItemContextMenuEvent } from 'devextreme/ui/context_menu';
import { ContextMenuItemItemModel } from '../../../models/context-menu-item-props';

const TrackSheetMainContextMenu = ({ innerRef, commands }: ContextMenuProps) => {

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
                text: 'Экспорт в XLSX...',
                renderIconItem: () => <ExportToXlsxIcon size={ 18 }/>,
                onClick: async (e: ItemContextMenuEvent) => {
                    await e.component.hide();
                    if(commands.refreshAsync) {
                        await commands.exportToXlsx();
                    }
                }
            }
        ] as ContextMenuItemItemModel[];
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

export default React.forwardRef<ContextMenu<ContextMenuItemItemModel>, ContextMenuProps>((props, ref) =>
  <TrackSheetMainContextMenu { ...props } innerRef={ ref } />);

