import React from 'react';
import ContextMenu from 'devextreme-react/context-menu';

const TrackMapPopupMenu = ({ innerRef, initialDate, onRefreshTokenItemClick, onShowWorkDatePickerItemClick }) => {

    const items = [
        {
            name: 'refresh',
            text: 'Обновить',
            icon: 'refresh',
            onClick: (e) => {
                e.component.hide();
                onRefreshTokenItemClick(e);
            },
        },
        {
            name: 'workDate',
            text: 'Рабочая дата',
            icon: 'event',
            onClick: (e) => {
                e.component.hide();
                onShowWorkDatePickerItemClick(e);
            }
        } ];
    return <ContextMenu
        ref={ innerRef }
        showEvent={ 'suppress' }
        items={ items.filter(i => !initialDate || i.name !== 'workDate' ) }
        position={ { my: 'top right', at: 'bottom right' } }
    />
}

export default React.forwardRef((props, ref) => <TrackMapPopupMenu innerRef={ ref } { ...props } />);
