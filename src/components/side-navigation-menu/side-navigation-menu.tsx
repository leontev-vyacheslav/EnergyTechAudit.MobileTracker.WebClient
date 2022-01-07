import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import TreeView from 'devextreme-react/tree-view';
import * as events from 'devextreme/events';
import { navigation } from '../../constants/app-navigation';
import { useNavigation } from '../../contexts/navigation';
import { useScreenSize } from '../../utils/media-query';
import { useSharedArea } from '../../contexts/shared-area';

import './side-navigation-menu.scss';
import { useAppSettings } from '../../contexts/app-settings';
import { useAuth } from '../../contexts/auth';
import { AppSettingsContextModel } from '../../models/app-settings-context';
import { AuthContextModel } from '../../models/auth-context';

export default function SideNavigationMenu (props: any) {
    const {
        children,
        selectedItemChanged,
        openMenu,
        compactMode,
        onMenuReady
    } = props;

    const { isLarge } = useScreenSize();
    const { showWorkDatePicker, signOutWithConfirm } = useSharedArea();
    const { navigationData: { currentPath } } = useNavigation();
    const { setWorkDateToday }: AppSettingsContextModel = useAppSettings();
    const { user }: AuthContextModel = useAuth();
    const treeViewRef = useRef<TreeView<any>>(null) ;
    const wrapperRef = useRef();

    function normalizePath () {
        return navigation
            .filter(i => !i.restricted || (i.restricted && user.organizationId === null) )
            .map((item) => {
                if (item.path && !( /^\//.test(item.path) )) {
                    item.path = `/${ item.path }`;
                }
                if(item.items) {
                    item.items = item.items.filter(i => i.restricted === false || (i.restricted === true && user.organizationId === null))
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
        events.on(element, 'dxclick', () => {
            openMenu();
        });
    }, [openMenu]);

    useEffect(() => {
      (async () => {
        const treeView = treeViewRef.current && treeViewRef.current.instance;
        if (!treeView) {
          return;
        }
        if (currentPath !== undefined) {
          treeView.selectItem(currentPath);
          await treeView.expandItem(currentPath);
        }
        if (compactMode) {
          treeView.collapseAll();
        }
      })();
    }, [currentPath, compactMode]);

    SideNavigationMenu.treeViewRef = treeViewRef;

    const TreeViewItemContent = (e: any) => {
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
                      if (event.itemData) {
                        if (event.itemData.command === 'workDate') {
                          showWorkDatePicker();
                        }
                        if (event.itemData.command === 'exit') {
                          signOutWithConfirm();
                        }
                        if (event.itemData.command === 'workDateToday') {
                          setWorkDateToday();
                        }
                        selectedItemChanged(event);
                      }
                    } }
                    onContentReady={ onMenuReady }
                    width={ '100%' }
                />
            </div>
        </div>
    );
}
