import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import { ExportToXlsxIcon } from '../../../../constants/app-icons';
import ContextMenuItem from '../../../../components/context-menu-item/context-menu-item';

const TimelineMainContextMenu = ({ innerRef, commands }) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Экспорт в XLSX...',
                renderIconItem: () => <ExportToXlsxIcon size={ 18 }/>,
                onClick: async (e) => {
                    e.component.hide();
                    if(commands.exportToXlsx) {
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
        position={ { my: 'top left', at: 'bottom left' } }
    />
}

export default React.forwardRef((props, ref) => <TimelineMainContextMenu
    innerRef={ ref } { ...props }
/>);

