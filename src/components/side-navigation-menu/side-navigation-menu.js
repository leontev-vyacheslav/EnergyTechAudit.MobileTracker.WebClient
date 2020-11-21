import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import TreeView from 'devextreme-react/tree-view';
import * as events from 'devextreme/events';
import { navigation } from '../../app-navigation';
import { useNavigation } from '../../contexts/navigation';
import { useScreenSize } from '../../utils/media-query';
import { useSharedArea } from '../../contexts/shared-area';
import { confirm } from 'devextreme/ui/dialog';

import './side-navigation-menu.scss';
import { useAuth } from '../../contexts/auth';

export default function (props) {
    const { signOut } = useAuth();
    const { workDatePickerRef } = useSharedArea();
    const {
        children,
        selectedItemChanged,
        openMenu,
        compactMode,
        onMenuReady
    } = props;

    const { isLarge } = useScreenSize();

    function normalizePath () {
        return navigation.map((item) => {
            if (item.path && !( /^\//.test(item.path) )) {
                item.path = `/${ item.path }`;
            }
            return { ...item, expanded: isLarge }
        })
    }

    const items = useMemo(
        normalizePath,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const { navigationData: { currentPath } } = useNavigation();


    const treeViewRef = useRef();
    const wrapperRef = useRef();

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

    return (
        <div
            className={ 'dx-swatch-additional side-navigation-menu' }
            ref={ getWrapperRef }
        >
            { children }
            <div className={ 'menu-container' }>
                <TreeView
                    ref={ treeViewRef }
                    items={ items }
                    keyExpr={ 'path' }
                    selectionMode={ 'single' }
                    focusStateEnabled={ true }
                    expandEvent={ 'click' }
                    onItemClick={ event => {
                        if(event.itemData.command === 'workDate') {
                            if (workDatePickerRef.current) {
                                workDatePickerRef.current.instance.open();
                            }
                        }
                        if(event.itemData.command === 'exit') {
                            const result = confirm('<div style="display: flex; align-items: center"><i class="dx-icon dx-icon-runner" style="font-size: 3em"></i><span>Действительно <b>выйти</b> из приложения!</span></div>', 'Выход');
                            result.then((dialogResult) => {
                                if(dialogResult) {
                                    signOut();
                                }
                            });
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
