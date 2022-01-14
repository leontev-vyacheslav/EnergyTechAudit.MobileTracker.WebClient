import React from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import { ScheduleIcon } from '../../../../constants/app-icons';
import ContextMenuItem from '../../../context-menu-item/context-menu-item';
import { ContextMenuProps } from '../../../../models/context-menu-props';
import { ItemContextMenuEvent } from 'devextreme/ui/context_menu';
import { ContextMenuItemItemModel } from '../../../../models/context-menu-item-props';

const OrganizationPopupMenu = ({ innerRef,  commands }: ContextMenuProps) => {

    const items: ContextMenuItemItemModel[] = [
        {
            name: 'addSchedule',
            text: 'Добавить расписание',
            renderIconItem: () => <ScheduleIcon size={ 18 }/>,
            onClick: async (e: ItemContextMenuEvent) => {
                await e.component.hide();
                commands.addSchedule();
            },
        }] ;

    return <ContextMenu
        ref={ innerRef }
        itemRender={ (item) => <ContextMenuItem item={ item } /> }
        showEvent={ 'suppress' }
        items={ items.filter(i => !!i ) }
        position={ { my: 'right top', at: 'right bottom' } }
    />
}

export default React.forwardRef<ContextMenu<ContextMenuItemItemModel>, ContextMenuProps>((props, ref) =>
  <OrganizationPopupMenu  { ...props } innerRef={ ref } />
);
