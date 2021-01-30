import React from 'react';

const DataGridIconCellValueContainer = ({ cellDataFormatter, iconRenderer, rowStyle }) => {
    const iconProps = { style: {} };
    return (
        <div style={ { ...{ display: 'grid', gridTemplateColumns: '20px 1fr', alignItems: 'center' }, ...rowStyle } }>
            { iconRenderer(iconProps) }
            <span>{ cellDataFormatter() }</span>
        </div>

    )
}

export default DataGridIconCellValueContainer;
