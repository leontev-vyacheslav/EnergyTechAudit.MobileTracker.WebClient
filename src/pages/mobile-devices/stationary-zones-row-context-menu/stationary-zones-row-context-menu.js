import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';

import { TrackMapIcon } from '../../../constants/app-icons';
import ContextMenuItem from '../../../components/context-menu-item/context-menu-item';

const StationaryZonesRowContextMenu = ({ innerRef, commands }) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Показать на карте...',
                renderIconItem: () => <TrackMapIcon size={ 18 }/>,
                onClick: (e) => {
                    e.component.hide();
                    commands.showTrackMap();
                }
            }];
    }, [commands]);

    return <ContextMenu
        ref={ innerRef }
        closeOnOutsideClick={ true }
        itemRender={ (item) => <ContextMenuItem item={ item } /> }
        showEvent={ 'suppress' }
        items={ items }
        position={ { my: 'top left', at: 'bottom left' } }
    />
}

export default React.forwardRef((props, ref) => <StationaryZonesRowContextMenu
    innerRef={ ref } { ...props }
/>);

