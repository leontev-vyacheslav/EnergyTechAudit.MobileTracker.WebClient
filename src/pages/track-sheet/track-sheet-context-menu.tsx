import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import ContextMenuItem from '../../components/context-menu-item/context-menu-item';
import { TrackMapIcon } from '../../constants/app-icons';
import { ContextMenuProps } from '../../models/context-menu-props';
import { ItemContextMenuEvent } from 'devextreme/ui/context_menu';

const TrackSheetContextMenu = ({ innerRef, commands }: ContextMenuProps) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Показать на карте...',
                renderIconItem: () => <TrackMapIcon size={ 18 }/>,
                onClick: async (e: ItemContextMenuEvent) => {
                    await e.component.hide();
                    commands.showTrackMap(e);
                }
            }];
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
  <TrackSheetContextMenu { ...props }  innerRef={ ref }/>
);

