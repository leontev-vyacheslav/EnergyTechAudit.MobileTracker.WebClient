import React from 'react';

const IconTab = ({ tab, children }) => {
    return (
        <div style={ { display: 'grid', gridTemplateColumns: '20px 1fr', gridGap: 5, alignItems: 'center' } }>
            { children }
            <span className="dx-tab-text">{ tab.title }</span>
        </div>
    );
}
export default IconTab;
