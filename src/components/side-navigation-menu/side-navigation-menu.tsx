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

type TreeViewItemModel = {
  expanded: boolean,
  text: string,
  icon: () => JSX.Element,
  path: string | undefined,
  restricted: boolean,
  items?: any[],
  command?: string
} | any

export default function SideNavigationMenu (props: any) {
    const {
        children,
        selectedItemChanged,
        openMenu,
        compactMode,
        onMenuReady
    } = props;

    const { isLarge } = useScreenSize();
    const { showWorkDatePicker, signOutWithConfirm, treeViewRef } = useSharedArea();
    const { navigationData: { currentPath } } = useNavigation();
    const { setWorkDateToday } = useAppSettings();
    const { user } = useAuth();

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

    const items: TreeViewItemModel[] = useMemo<TreeViewItemModel[]>(
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
        const treeView = treeViewRef.current?.instance;
        if (treeView) {
          if (currentPath !== undefined) {
            treeView.selectItem(currentPath);
            try {
              await treeView.expandItem(currentPath);
            } catch (ex) {
              //
            }
          }
          if (compactMode) {
            treeView.collapseAll();
          }
        }
      })();
    }, [currentPath, compactMode, treeViewRef]);

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
                        const treeViewItem: TreeViewItemModel =  event.itemData as TreeViewItemModel;
                        if (treeViewItem.command === 'workDate') {
                          showWorkDatePicker();
                        }
                        if (treeViewItem.command === 'exit') {
                          signOutWithConfirm();
                        }
                        if (treeViewItem.command === 'workDateToday') {
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
