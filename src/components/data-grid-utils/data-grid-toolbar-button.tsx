import React from 'react';
import { Button } from 'devextreme-react/button';
import { GridAdditionalMenuIcon } from '../../constants/app-icons';

const onDataGridToolbarPreparing = (e: any) => {
    if (e?.toolbarOptions) {
        e.toolbarOptions.items.forEach((i: any) => {
            i.location = 'before';
        })

        e.toolbarOptions.items.unshift({
                location: 'before',
                template: 'DataGridToolbarButtonTemplate'
            }
        );
    }
}

const DataGridToolbarButton = ({ contextMenuRef }: { contextMenuRef: any }) => {
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

export { onDataGridToolbarPreparing, DataGridToolbarButton };
