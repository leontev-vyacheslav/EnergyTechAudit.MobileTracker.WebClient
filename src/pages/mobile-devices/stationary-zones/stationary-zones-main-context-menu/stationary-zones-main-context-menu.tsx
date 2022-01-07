import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';

import { ExportToXlsxIcon } from '../../../../constants/app-icons';
import ContextMenuItem from '../../../../components/context-menu-item/context-menu-item';
import { ContextMenuProps } from '../../../../models/context-menu-props';
import {
    ContextMenuItemItemModel
} from '../../../../components/data-grid-main-context-menu/data-grid-main-context-menu';

const StationaryZoneMainContextMenu = ({ innerRef, commands }: ContextMenuProps) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Экспорт в XLSX...',
                renderIconItem: () => <ExportToXlsxIcon size={ 18 }/>,
                onClick: async (e: any) => {
                    e.component.hide();
                    if(commands.exportToXlsx) {
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

export default React.forwardRef<any, ContextMenuProps>((props, ref) =>
  <StationaryZoneMainContextMenu { ...props } innerRef={ ref } />
);

