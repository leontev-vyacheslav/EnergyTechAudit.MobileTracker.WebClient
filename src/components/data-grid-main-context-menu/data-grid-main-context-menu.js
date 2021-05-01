import React, { useMemo } from 'react';
import { AddIcon, ExportToXlsxIcon, RefreshIcon } from '../../constants/app-icons';
import ContextMenu from 'devextreme-react/context-menu';
import ContextMenuItem from '../context-menu-item/context-menu-item';

const DataGridMainContextMenu = ({ innerRef, commands }) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Обновить...',
                renderIconItem: () => <RefreshIcon size={ 18 }/>,
                onClick: async (e) => {
                    e.component.hide();
                    if(commands.refreshAsync) {
                        await commands.refreshAsync();
                    }
                }
            },
            {
                text: 'Добавить...',
                renderIconItem: () => <AddIcon size={ 18 }/>,
                onClick: (e) => {
                    e.component.hide();
                    if(commands.addAsync) {
                        commands.addAsync();
                    }
                }
            },
            {
                text: 'Экспорт в XLSX...',
                renderIconItem: () => <ExportToXlsxIcon size={ 18 }/>,
                onClick: async (e) => {
                    e.component.hide();
                    if(commands.exportToXlsx) {
                        await commands.exportToXlsx();
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

export default React.forwardRef((props, ref) => <DataGridMainContextMenu
    innerRef={ ref } { ...props }
/>);
