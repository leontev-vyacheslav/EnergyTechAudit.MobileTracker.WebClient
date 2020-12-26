import React from 'react';
import ContextMenu from 'devextreme-react/context-menu';
import { FitToMapIcon } from '../../../../../utils/app-icons';

const TrackMapPopupMenu = ({ innerRef, initialDate, commands }) => {

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

    const items = [
        {
            name: 'refresh',
            text: 'Обновить',
            icon: 'refresh',
            onClick: (e) => {
                e.component.hide();
                commands.refreshToken();
            },
        },
        {
            name: 'fitToMap',
            text: 'По размеру',
            renderItem: (e) => {
                return (
                    <>
                        <i style={ { marginRight: 24, marginTop: 4 } } className={ 'dx-icon' }>
                            <FitToMapIcon size={ 18 }/>
                        </i>
                        <span className="dx-menu-item-text">{ e.text }</span>
                    </>
                )
            },
            onClick: (e) => {
                e.component.hide();
                commands.fitToMap();
            },
        },
        {
            name: 'workDate',
            text: 'Рабочая дата',
            icon: 'event',
            onClick: (e) => {
                e.component.hide();
                commands.showWorkDatePicker();
            }
        } ];
    return <ContextMenu
        ref={ innerRef }
        itemRender={ ItemTemplate }
        showEvent={ 'suppress' }
        items={ items.filter(i => !initialDate || i.name !== 'workDate' ) }
        position={ { my: 'top right', at: 'bottom right' } }
    />
}

export default React.forwardRef((props, ref) => <TrackMapPopupMenu innerRef={ ref } { ...props } />);
