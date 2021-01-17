import React, { useMemo } from 'react';
import ContextMenu from 'devextreme-react/context-menu';

import { AddOrganizationIcon } from '../../../constants/app-icons';
import ContextMenuItem from '../../../components/context-menu-item/context-menu-item';

const OrganizationMainContextMenu = ({ innerRef, commands }) => {

    const items = useMemo(() => {
        return [
            {
                text: 'Добавить организацию...',
                renderIconItem: () => <AddOrganizationIcon size={ 18 }/>,
                onClick: (e) => {
                    e.component.hide();
                    if(commands.addOrganization) {
                        commands.addOrganization();
                    }
                }
            }];
    }, [commands]);

    return <ContextMenu
        ref={ innerRef }
        closeOnOutsideClick={ true }
        itemRender={ (item) => <ContextMenuItem item={ item } /> }
        showEvent={ 'suppress' }
        items={ items }
        position={ { my: 'top left', at: 'bottom left' } }
    />
}

export default React.forwardRef((props, ref) => <OrganizationMainContextMenu
    innerRef={ ref } { ...props }
/>);

