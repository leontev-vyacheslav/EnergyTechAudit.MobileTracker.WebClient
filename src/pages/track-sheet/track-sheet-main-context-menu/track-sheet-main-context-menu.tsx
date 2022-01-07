import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import { ExportToXlsxIcon, RefreshIcon } from '../../../constants/app-icons';
import ContextMenuItem from '../../../components/context-menu-item/context-menu-item';
import { ContextMenuProps } from '../../../models/context-menu-props';

const TrackSheetMainContextMenu = ({ innerRef, commands }: ContextMenuProps) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Обновить...',
                renderIconItem: () => <RefreshIcon size={ 18 }/>,
                onClick: async (e: any) => {
                    e.component.hide();
                    if(commands.refreshAsync) {
                        await commands.refreshAsync();
                    }
                }
            },
            {
                text: 'Экспорт в XLSX...',
                renderIconItem: () => <ExportToXlsxIcon size={ 18 }/>,
                onClick: async (e: any) => {
                    e.component.hide();
                    if(commands.refreshAsync) {
                        await commands.exportToXlsx();
                    }
                }
            }
        ];
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
  <TrackSheetMainContextMenu { ...props } innerRef={ ref } />);

