import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';

import { TimelineIcon } from '../../../utils/app-icons';

const MobileDeviceContextMenu = ({ innerRef, onShowTrackMapItemClick, onShowCoveredDistanceItemClick }) => {

    function ItemTemplate (e) {
        return (
            <>
                { e.renderItem ? e.renderItem(e) : (
                    <>
                        <i style={ { marginRight: 24 } } className={ `dx-icon dx-icon-${ e.icon }` }/>
                        <span className="dx-menu-item-text">{ e.text }</span>
                    </>
                ) }
            </>
        );
    }

    const items = useMemo(() => {
        return [
            {
                text: 'Показать на карте...',
                icon: 'map',
                onClick: (e) => {
                    e.component.hide();
                    onShowTrackMapItemClick(e);
                }
            },
            {
                text: 'Пройдено за месяц...',
                icon: 'range',
                renderItem: (e) => {
                    return (
                        <>
                            <i style={ { marginRight: 24, marginTop: 4 } } className={ 'dx-icon' }>
                                <TimelineIcon size={ 18 }/>
                            </i>
                            <span className="dx-menu-item-text">{ e.text }</span>
                        </>
                    )
                },
                onClick: (e) => {
                    e.component.hide();
                    onShowCoveredDistanceItemClick(e);
                }
            }];
    }, [onShowCoveredDistanceItemClick, onShowTrackMapItemClick]);

    return <ContextMenu
        ref={ innerRef }
        closeOnOutsideClick={ true }
        itemRender={ ItemTemplate }
        showEvent={ 'suppress' }
        items={ items }
        position={ { my: 'top left', at: 'bottom left' } }
    />
}

export default React.forwardRef((props, ref) => <MobileDeviceContextMenu
    innerRef={ ref } { ...props }
/>);

