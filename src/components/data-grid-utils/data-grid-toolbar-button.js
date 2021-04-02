import React from 'react';
import { Button } from 'devextreme-react/button';
import { GridAdditionalMenuIcon } from '../../constants/app-icons';

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

export { DataGridToolbarButton };
