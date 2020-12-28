import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';

import { TimelineIcon, TrackMapIcon } from '../../../utils/app-icons';
import ContextMenuItem from '../../../components/context-menu-item/context-menu-item';

const MobileDeviceContextMenu = ({ innerRef, commands }) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Показать на карте...',
                renderItem: () => <TrackMapIcon size={ 18 }/>,
                onClick: (e) => {
                    e.component.hide();
                    commands.showTrackMap();
                }
            },
            {
                text: 'Пройдено за месяц...',
                renderItem: () => <TimelineIcon size={ 18 }/>,
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

export default React.forwardRef((props, ref) => <MobileDeviceContextMenu
    innerRef={ ref } { ...props }
/>);

