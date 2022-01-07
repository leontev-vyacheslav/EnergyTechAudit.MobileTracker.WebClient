import React from 'react';
import  PropTypes from  'prop-types';
import ContextMenu from 'devextreme-react/context-menu';
import { ScheduleIcon } from '../../../../constants/app-icons';
import ContextMenuItem from '../../../context-menu-item/context-menu-item';
import { ContextMenuProps } from '../../../../models/context-menu-props';

const OrganizationPopupMenu = ({ innerRef,  commands }: ContextMenuProps) => {

    const items = [
        {
            name: 'addSchedule',
            text: 'Добавить расписание',
            renderIconItem: () => <ScheduleIcon size={ 18 }/>,
            onClick: (e: any) => {
                e.component.hide();
                commands.addSchedule();
            },
        }];

    return <ContextMenu
        ref={ innerRef }
        itemRender={ (item) => <ContextMenuItem item={ item } /> }
        showEvent={ 'suppress' }
        items={ items.filter(i => !!i ) }
        position={ { my: 'right top', at: 'right bottom' } }
    />
}

OrganizationPopupMenu.propTypes = {
    innerRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any })
    ]),
    commands: PropTypes.object.isRequired
}

export default React.forwardRef<any, ContextMenuProps>((props, ref) =>
  <OrganizationPopupMenu  { ...props } innerRef={ ref } />
);
