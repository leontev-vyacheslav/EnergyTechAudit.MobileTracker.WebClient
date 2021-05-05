import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'devextreme-react/button';
import { GridAdditionalMenuIcon } from '../../constants/app-icons';

const onDataGridToolbarPreparing = (e) => {
    if (e?.toolbarOptions) {
        e.toolbarOptions.items.forEach(i => {
            i.location = 'before';
        })

        e.toolbarOptions.items.unshift(
            {
                location: 'before',
                template: 'DataGridToolbarButtonTemplate'
            }
        );
    }
}

const DataGridToolbarButton = ({ contextMenuRef }) => {
    return (
        <Button className={ 'app-command-button app-command-button-small' } onClick={ (e) => {
            if (contextMenuRef && contextMenuRef.current) {
                contextMenuRef.current.instance.option('target', e.element);
                contextMenuRef.current.instance.show();
            }
        } }>
            <GridAdditionalMenuIcon/>
        </Button>
    );
}

DataGridToolbarButton.propTypes = {
    contextMenuRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.any })
    ])
}

export { onDataGridToolbarPreparing, DataGridToolbarButton };