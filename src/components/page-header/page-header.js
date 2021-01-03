import React from 'react';

const PageHeader = ({ caption, children }) => {
    return (
        <div style={ { color: 'rgba(0, 0, 0, 0.87)', display: 'grid', gridTemplateColumns: '30px 1fr', marginLeft: 20, alignItems: 'center' } }>
            { children }
            <h2 className={ 'content-block' }>{ caption }</h2>
        </div>
    );
}

export default PageHeader;
