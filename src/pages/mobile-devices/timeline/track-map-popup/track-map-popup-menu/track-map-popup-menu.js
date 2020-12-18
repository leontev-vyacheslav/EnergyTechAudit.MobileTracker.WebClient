import React from 'react';
import ContextMenu from 'devextreme-react/context-menu';

const TrackMapPopupMenu = ({ innerRef, onRefreshTokenItemClick, onShowWorkDatePickerItemClick }) => {

    return <ContextMenu
        ref={ innerRef }
        showEvent={ 'suppress' }
        items={ [
            {
                text: 'Обновить',
                icon: 'refresh',
                onClick: (e) => {
                    e.component.hide();
                    onRefreshTokenItemClick(e);
                },
            },
            {
                text: 'Рабочая дата',
                icon: 'event',
                onClick: (e) => {
                    e.component.hide();
                    onShowWorkDatePickerItemClick(e);
                }
            } ] }
        position={ { my: 'top right', at: 'bottom right' } }
    />
}

export default React.forwardRef((props, ref) => <TrackMapPopupMenu innerRef={ ref } { ...props } />);
