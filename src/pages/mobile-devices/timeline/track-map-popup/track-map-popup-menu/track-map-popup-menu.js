import React from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import { FitToMapIcon, RefreshIcon, WorkDateIcon } from '../../../../../utils/app-icons';
import ContextMenuItem from '../../../../../components/context-menu-item/context-menu-item';

const TrackMapPopupMenu = ({ innerRef, initialDate, commands }) => {

    const items = [
        {
            name: 'refresh',
            text: 'Обновить',
            renderItem: () => <RefreshIcon size={ 18 }/>,
            onClick: (e) => {
                e.component.hide();
                commands.refreshToken();
            },
        },
        {
            name: 'fitToMap',
            text: 'По размеру',
            renderItem: () => <FitToMapIcon size={ 18 }/>,
            onClick: (e) => {
                e.component.hide();
                commands.fitToMap();
            },
        },
        {
            name: 'workDate',
            text: 'Рабочая дата',
            renderItem: () => <WorkDateIcon size={ 18 }/>,
            onClick: (e) => {
                e.component.hide();
                commands.showWorkDatePicker();
            }
        } ];
    return <ContextMenu
        ref={ innerRef }
        itemRender={ (item) => <ContextMenuItem item={ item } /> }
        showEvent={ 'suppress' }
        items={ items.filter(i => !initialDate || i.name !== 'workDate' ) }
        position={ { my: 'top right', at: 'bottom right' } }
    />
}

export default React.forwardRef((props, ref) => <TrackMapPopupMenu innerRef={ ref } { ...props } />);
