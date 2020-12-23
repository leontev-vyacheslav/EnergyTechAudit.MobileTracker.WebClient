import React from 'react';

const DataGridIconCellValueContainer  = ({ cellDataFormatter, iconRenderer }) => {
    const iconProps = { style: {  }, size: 18, color: '#464646' };
    return (
        <>
            <div style={ { display: 'grid', gridTemplateColumns: '20px 1fr', alignItems: 'center' } }>
                { iconRenderer(iconProps) }
                <span>{  cellDataFormatter() }</span>
            </div>
        </>
    )
}

export  default  DataGridIconCellValueContainer;
