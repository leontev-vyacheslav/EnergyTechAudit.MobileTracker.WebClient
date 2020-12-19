import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';

const TrackSheetContextMenu = ({ innerRef, onShowTrackMapItemClick }) => {

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
            }];
    }, [onShowTrackMapItemClick]);

    return <ContextMenu
        ref={ innerRef }
        closeOnOutsideClick={ true }
        itemRender={ ItemTemplate }
        showEvent={ 'suppress' }
        items={ items }
        position={ { my: 'top left', at: 'bottom left' } }
    />
}

export default React.forwardRef((props, ref) => <TrackSheetContextMenu
    innerRef={ ref } { ...props }
/>);

