import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import ContextMenuItem from '../../components/context-menu-item/context-menu-item';
import { TrackMapIcon } from '../../utils/app-icons';

const TrackSheetContextMenu = ({ innerRef, onShowTrackMapItemClick }) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Показать на карте...',
                renderItem: () => <TrackMapIcon size={ 18 }/>,
                onClick: (e) => {
                    e.component.hide();
                    onShowTrackMapItemClick(e);
                }
            }];
    }, [onShowTrackMapItemClick]);

    return <ContextMenu
        ref={ innerRef }
        closeOnOutsideClick={ true }
        itemRender={ (item) => <ContextMenuItem item={ item } /> }
        showEvent={ 'suppress' }
        items={ items }
        position={ { my: 'top left', at: 'bottom left' } }
    />
}

export default React.forwardRef((props, ref) => <TrackSheetContextMenu
    innerRef={ ref } { ...props }
/>);

