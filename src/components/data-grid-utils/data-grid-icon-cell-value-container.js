import React from 'react';
import PropTypes from 'prop-types';

const DataGridIconCellValueContainer = ({ cellDataFormatter, iconRenderer, rowStyle }) => {
    const iconProps = { style: {} };
    return (
        <div style={ { ...{ display: 'grid', gridTemplateColumns: '20px 1fr', alignItems: 'center', columnGap: 5 }, ...rowStyle } }>
            { iconRenderer(iconProps) }
            <span>{ cellDataFormatter() }</span>
        </div>

    )
}

DataGridIconCellValueContainer.propTypes = {
    cellDataFormatter: PropTypes.func.isRequired,
    iconRenderer: PropTypes.func.isRequired,
    rowStyle: PropTypes.object
}

export default DataGridIconCellValueContainer;
