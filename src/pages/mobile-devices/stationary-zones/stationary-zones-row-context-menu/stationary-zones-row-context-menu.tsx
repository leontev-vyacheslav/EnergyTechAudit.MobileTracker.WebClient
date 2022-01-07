import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import { TrackMapIcon } from '../../../../constants/app-icons';
import ContextMenuItem from '../../../../components/context-menu-item/context-menu-item';
import { ContextMenuProps } from '../../../../models/context-menu-props';
import {
    ContextMenuItemItemModel
} from '../../../../components/data-grid-main-context-menu/data-grid-main-context-menu';

const StationaryZonesRowContextMenu = ({ innerRef, commands }: ContextMenuProps) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Показать на карте...',
                renderIconItem: () => <TrackMapIcon size={ 18 }/>,
                onClick: (e) => {
                    e.component.hide();
                    commands.showTrackMap();
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
  <StationaryZonesRowContextMenu { ...props } innerRef={ ref } />
);

