import React from 'react';
import { ContextMenuItemItemModel } from '../data-grid-main-context-menu/data-grid-main-context-menu';

const ContextMenuItem = ({ item }: { item: ContextMenuItemItemModel }) => {
    return (
        // Todo: css
        <div style={ { display: 'grid', gridTemplateColumns: '25px 1fr', alignItems: 'center', gap: 10 } }>
            { item.renderIconItem(item) }
            { item.renderTextItem
                ? item.renderTextItem(item)
                : <span className="dx-menu-item-text">{ item.text }</span>
            }
        </div>
    );
}
export default ContextMenuItem;
