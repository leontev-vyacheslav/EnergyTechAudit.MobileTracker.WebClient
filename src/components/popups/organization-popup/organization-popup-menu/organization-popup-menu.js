import React from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import { ScheduleIcon } from '../../../../constants/app-icons';
import ContextMenuItem from '../../../context-menu-item/context-menu-item';

const OrganizationPopupMenu = ({ innerRef,  commands }) => {

    const items = [
        {
            name: 'addSchedule',
            text: 'Добавить расписание',
            renderIconItem: () => <ScheduleIcon size={ 18 }/>,
            onClick: (e) => {
                e.component.hide();
                commands.addSchedule();
            },
        }];
    return <ContextMenu
        ref={ innerRef }
        itemRender={ (item) => <ContextMenuItem item={ item } /> }
        showEvent={ 'suppress' }
        items={ items.filter(i => !!i ) }
        position={ { my: 'top right', at: 'bottom right' } }
    />
}

export default React.forwardRef((props, ref) => <OrganizationPopupMenu innerRef={ ref } { ...props } />);
