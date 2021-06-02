import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';

import { TimelineIcon, TrackMapIcon } from '../../../constants/app-icons';
import ContextMenuItem from '../../../components/context-menu-item/context-menu-item';

const MobileDeviceRowContextMenu = ({ innerRef, commands }) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Показать на карте...',
                renderIconItem: () => <TrackMapIcon size={ 18 }/>,
                onClick: (e) => {
                    e.component.hide();
                    commands.showTrackMap(e);
                }
            },
            {
                text: 'Пройдено за месяц...',
                renderIconItem: () => <TimelineIcon size={ 18 }/>,
                onClick: (e) => {
                    e.component.hide();
                    commands.showTrackSheet();
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

export default React.forwardRef((props, ref) => <MobileDeviceRowContextMenu
    innerRef={ ref } { ...props }
/>);

