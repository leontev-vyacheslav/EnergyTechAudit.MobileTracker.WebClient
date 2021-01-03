import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import TreeView from 'devextreme-react/tree-view';
import * as events from 'devextreme/events';
import { navigation } from '../../app-navigation';
import { useNavigation } from '../../contexts/navigation';
import { useScreenSize } from '../../utils/media-query';
import { useSharedArea } from '../../contexts/shared-area';

import './side-navigation-menu.scss';

export default function SideNavigationMenu (props) {
    const {
        children,
        selectedItemChanged,
        openMenu,
        compactMode,
        onMenuReady
    } = props;

    const { showWorkDatePicker, signOutWithConfirm } = useSharedArea();
    const { navigationData: { currentPath } } = useNavigation();
    const treeViewRef = useRef();
    const wrapperRef = useRef();
    const { isLarge } = useScreenSize();

    function normalizePath () {
        return navigation.map((item) => {
            if (item.path && !( /^\//.test(item.path) )) {
                item.path = `/${ item.path }`;
            }
            return { ...item, expanded: isLarge }
        });
    }

    const items = useMemo(
        normalizePath,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const getWrapperRef = useCallback((element) => {
        const prevElement = wrapperRef.current;
        if (prevElement) {
            events.off(prevElement, 'dxclick');
        }
        wrapperRef.current = element;
        events.on(element, 'dxclick', e => {
            openMenu(e);
        });
    }, [openMenu]);

    useEffect(() => {
        const treeView = treeViewRef.current && treeViewRef.current.instance;
        if (!treeView) {
            return;
        }
        if (currentPath !== undefined) {
            treeView.selectItem(currentPath);
            treeView.expandItem(currentPath);
        }
        if (compactMode) {
            treeView.collapseAll();
        }
    }, [currentPath, compactMode]);

    SideNavigationMenu.treeViewRef = treeViewRef;

    const TreeViewItemContent = (e) => {
        return (
            <>
                { e.icon ? <i className="dx-icon">{ e.icon() }</i> : null }
                <span>{ e.text }</span>
            </>
        );
    }

    return (
        <div className={ 'dx-swatch-additional side-navigation-menu' } ref={ getWrapperRef }>
            { children }
            <div className={ 'menu-container' }>
                <TreeView
                    ref={ treeViewRef }
                    items={ items }
                    keyExpr={ 'path' }
                    selectionMode={ 'single' }
                    itemRender={ TreeViewItemContent }
                    focusStateEnabled={ true }
                    expandEvent={ 'click' }
                    onItemClick={ event => {
                        if (event.itemData.command === 'workDate') {
                            showWorkDatePicker();
                        }
                        if (event.itemData.command === 'exit') {
                            signOutWithConfirm();
                        }
                        selectedItemChanged(event);
                    } }
                    onContentReady={ onMenuReady }
                    width={ '100%' }
                />
            </div>
        </div>
    );
}


