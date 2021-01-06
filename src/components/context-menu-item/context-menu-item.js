import React from 'react';

const ContextMenuItem = ({ item }) => {
    return (
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
