import PageHeader from '../../components/page-header/page-header';
import { AdminIcon, EmailIcon, GridAdditionalMenuIcon } from '../../constants/app-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAppData } from '../../contexts/app-data';
import AppConstants from '../../constants/app-constants';
import DataGrid, { Column, Grouping, LoadPanel, Pager, Paging, Scrolling, SearchPanel } from 'devextreme-react/data-grid';
import { DataGridToolbarButton, onDataGridToolbarPreparing } from '../../components/data-grid-utils/data-grid-toolbar-button';
import { Template } from 'devextreme-react/core/template';
import { useScreenSize } from '../../utils/media-query';
import { Button } from 'devextreme-react/button';
import DataGridIconCellValueContainer from '../../components/data-grid-utils/data-grid-icon-cell-value-container';

import DataGridMainContextMenu from  '../../components/data-grid-main-context-menu/data-grid-main-context-menu';
import DataGridRowContextMenu from '../../components/data-grid-row-context-menu/data-grid-row-context-menu';

const Administrators = () => {

    const { getAdministratorsAsync } = useAppData();
    const { isXSmall } = useScreenSize();

    const [administrators, setAdministrators] = useState(null);

    const dxDataGridRef = useRef(null);
    const mainContextMenuRef = useRef();
    const groupRowContextMenuRef = useRef();
    const rowContextMenuRef = useRef();

    const refreshAsync = useCallback(async () => {
        const administrators = await getAdministratorsAsync();
        console.log(administrators);
        setAdministrators(administrators);
    }, [getAdministratorsAsync]);

    useEffect(() => {
        ( async () => {
            await refreshAsync();
        } )();
    }, [refreshAsync]);

    const GroupRowContent = ({ groupCell }) => {
        const items = groupCell.data.items === null ? groupCell.data.collapsedItems : groupCell.data.items;
        const groupDataItem = items[0];
        console.log(groupDataItem)
        return (
            <>
                <div className={ 'user-grid-group mobile-devices-group' }>
                    <Button className={ 'app-command-button app-command-button-small' } onClick={ (e) => {
                        dxDataGridRef.current.instance.option('focusedRowKey', groupCell.key);
                        e.event.stopPropagation();
                        if (groupRowContextMenuRef && groupRowContextMenuRef.current) {
                            groupRowContextMenuRef.current.instance.option('target', e.element);
                            groupRowContextMenuRef.current.instance.show();
                        }
                    } }>
                        <GridAdditionalMenuIcon/>
                    </Button>
                    <DataGridIconCellValueContainer
                        rowStyle={ { gridTemplateColumns: '25px 1fr' } }
                        cellDataFormatter={ () => {
                            return `${groupDataItem.organization ? groupDataItem.organization.shortName : 'Общая группа'}`;
                        } }
                        iconRenderer={ (iconProps) => {
                            return <AdminIcon { ...iconProps } />;
                        } }
                    />
                </div>
            </> );
    }

    if (!(administrators === null || administrators.length === 0))
    {
        return (
            <>
                <PageHeader caption={ 'Администраторы' }>
                    <AdminIcon size={ 30 }/>
                </PageHeader>
                <DataGrid
                    ref={ dxDataGridRef }
                    keyExpr={ 'id' }
                    className={ 'app-grid mobile-devices dx-card wide-card' }
                    noDataText={ AppConstants.noDataLongText }
                    dataSource={ administrators }
                    showBorders={ false }
                    focusedRowEnabled={ true }
                    showColumnHeaders={ !isXSmall }
                    defaultFocusedRowIndex={ 0 }
                    columnAutoWidth={ true }
                    columnHidingEnabled={ true }
                    onRowExpanding={ (e) => {
                        e.component.collapseAll(-1);
                    } }
                    onToolbarPreparing={ onDataGridToolbarPreparing }
                    onRowPrepared={ (e) => {
                        if (e.rowType === 'group' && e.data && e.data.items) {
                            if (e.data.items.find(o => !!o).office === null) {
                                const key = e.component.getKeyByRowIndex(e.rowIndex);
                                e.component.collapseRow(key);
                            }
                        }
                    } }
                >
                    <LoadPanel enabled={ false }/>
                    <Template name={ 'DataGridToolbarButtonTemplate' } render={ DataGridToolbarButton.bind(this, { contextMenuRef: mainContextMenuRef }) }/>
                    <SearchPanel visible={ true } searchVisibleColumnsOnly={ false }/>
                    <Scrolling showScrollbar={ 'never' }/>
                    <Paging defaultPageSize={ 10 }/>
                    <Pager showPageSizeSelector={ true } showInfo={ true }/>
                    <Grouping autoExpandAll={ true } key={ 'organizationId' }/>

                    <Column type={ 'buttons' } width={ 50 } cellRender={ () => {
                        return (
                            <Button className={ 'app-command-button app-command-button-small' } onClick={ (e) => {
                                if (rowContextMenuRef && rowContextMenuRef.current) {
                                    rowContextMenuRef.current.instance.option('target', e.element);
                                    rowContextMenuRef.current.instance.show();
                                }
                            } }>
                                <GridAdditionalMenuIcon/>
                            </Button>
                        )
                    } }
                    />

                    <Column
                        dataField={ 'organizationId' }
                        groupIndex={ 0 }
                        groupCellRender={ (groupCell) => <GroupRowContent groupCell={ groupCell }/> }
                        visible={ false }
                    />

                    <Column dataField={ 'email' } caption={ 'Почта' } width={ '100%' } allowSorting={ false } hidingPriority={ 4 }
                            cellRender={ (e) => {
                                return e.data.email ?
                                    <DataGridIconCellValueContainer
                                        rowStyle={ { gridTemplateColumns: '25px 1fr' } }
                                        cellDataFormatter={ () => {
                                            return e.data.email;
                                        } }
                                        iconRenderer={ (iconProps) => {
                                            return <EmailIcon { ...iconProps } />;
                                        } }
                                    />
                                    : null
                            } }
                    />

                </DataGrid>

                <DataGridMainContextMenu
                    ref={ mainContextMenuRef }
                    commands={
                        {
                            addAsync: () => {
                            },
                            refreshAsync: refreshAsync,
                            exportToXlsx: () => {
                            }
                        }
                    }/>
                    <DataGridRowContextMenu
                        ref={ rowContextMenuRef }
                        commands={
                            {
                                edit: () => {
                                },
                                delete: () => {
                                }
                            }
                        }
                    />
            </>
        )
    }

    return (
        <>
            <PageHeader caption={ 'Администраторы' }>
                <AdminIcon size={ 30 }/>
            </PageHeader>
            <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
        </>
    );
}

export default Administrators;
