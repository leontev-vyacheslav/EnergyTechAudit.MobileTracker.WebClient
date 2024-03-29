import PageHeader from '../../components/page-header/page-header';
import { AdminIcon, EmailIcon, GridAdditionalMenuIcon } from '../../constants/app-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppConstants from '../../constants/app-constants';
import DataGrid, {
    Column,
    Grouping,
    LoadPanel,
    Pager,
    Paging,
    Scrolling,
    SearchPanel
} from 'devextreme-react/data-grid';
import {
    DataGridToolbarButton,
    onDataGridToolbarPreparing
} from '../../components/data-grid-utils/data-grid-toolbar-button';
import { Template } from 'devextreme-react/core/template';
import { useScreenSize } from '../../utils/media-query';
import { Button } from 'devextreme-react/button';
import DataGridIconCellValueContainer from '../../components/data-grid-utils/data-grid-icon-cell-value-container';
import DataGridMainContextMenu from '../../components/data-grid-main-context-menu/data-grid-main-context-menu';
import DataGridRowContextMenu from '../../components/data-grid-row-context-menu/data-grid-row-context-menu';
import AdministratorPopup from '../../components/popups/administrator-popup/administrator-popup';
import { DialogConstants } from '../../constants/app-dialog-constant';
import { showConfirmDialog } from '../../utils/dialogs';
import { administratorExcelExporter } from './administrators-excel-exporter';
import { SimpleDialogModel } from '../../models/simple-dialog';
import ContextMenu from 'devextreme-react/context-menu';
import { AdministratorPopupModel } from '../../models/administrator-popup';
import { IconBaseProps } from 'react-icons/lib/cjs/iconBase';
import { useAppData } from '../../contexts/app-data';
import { UserModel } from '../../models/user';
import { ContextMenuItemItemModel } from '../../models/context-menu-item-props';
import dxDataGrid from 'devextreme/ui/data_grid';
import { Entity } from '../../models/entity';

const Administrators = () => {

    const { getAdminListAsync, deleteAdminAsync } = useAppData();
    const { isXSmall } = useScreenSize();

    const [administrators, setAdministrators] = useState<UserModel[] | null>(null);
    const [currentAdministrator, setCurrentAdministrator] = useState<UserModel | null>(null);
    const [administratorPopupTrigger, setAdministratorPopupTrigger] = useState<boolean>(false);

    const dxDataGridRef = useRef<DataGrid<UserModel, number>>(null);
    const mainContextMenuRef = useRef<ContextMenu<ContextMenuItemItemModel>>(null);
    const rowContextMenuRef = useRef<ContextMenu<ContextMenuItemItemModel>>(null);
    const editMode = useRef<boolean>(false);

    const updateDataAsync = useCallback(async () => {
        const administrators = await getAdminListAsync();
        setAdministrators(administrators);
    }, [getAdminListAsync]);

    const add = useCallback( () => {
        editMode.current = false;
        setAdministratorPopupTrigger(true);
    }, []);

    const edit = useCallback(() => {
        if (dxDataGridRef.current && dxDataGridRef.current.instance) {
            const currentRowKey = dxDataGridRef.current.instance.option('focusedRowKey');
            const administrator = administrators?.find(adm => adm?.id === currentRowKey);
            if (administrator) {
                setCurrentAdministrator(administrator);
                editMode.current = true;
                setAdministratorPopupTrigger(true);
            }
        }
    }, [administrators]);

    const remove = useCallback( async () => {
        showConfirmDialog({
            title: 'Предупреждение',
            iconName: 'WarningIcon',
            textRender: () => <>Действительно хотите <b>удалить</b> администратора!</>,
            callback: async () => {
                if (dxDataGridRef.current && dxDataGridRef.current.instance) {
                    const currentRowKey = dxDataGridRef.current.instance.option('focusedRowKey');
                    if(currentRowKey) {
                        await deleteAdminAsync(currentRowKey);
                        await updateDataAsync();
                    }
                }
            }
        } as SimpleDialogModel);

    }, [deleteAdminAsync, updateDataAsync]);

    useEffect(() => {
        ( async () => {
            await updateDataAsync();
        } )();
    }, [updateDataAsync]);

    const GroupRowContent = ({ groupCell }: any) => {
        const items = groupCell.data.items === null ? groupCell.data.collapsedItems : groupCell.data.items;
        const groupDataItem = items[0];
        return (
            <>
                <div className={ 'user-grid-group mobile-devices-group' }>
                    <DataGridIconCellValueContainer
                        rowStyle={ { gridTemplateColumns: '25px 1fr' } }
                        cellDataFormatter={ () => {
                            return `${groupDataItem.organization ? groupDataItem.organization.shortName : 'Общая группа'}`;
                        } }
                        iconRenderer={ (iconProps: IconBaseProps) => {
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
                    <AdminIcon size={ AppConstants.headerIconSize }/>
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
                    onRowPrepared={ async (e: any) => {
                        if (e.rowType === 'group' && e.data && e.data.items) {
                            if (e.data.items.find((o: any) => !!o).office === null) {
                                const key = e.component.getKeyByRowIndex(e.rowIndex);
                                await e.component.collapseRow(key);
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
                            <Button className={ 'app-command-button app-command-button-small' } onClick={ async e => {
                                if (rowContextMenuRef && rowContextMenuRef.current) {
                                    rowContextMenuRef.current.instance.option('target', e.element);
                                    await rowContextMenuRef.current.instance.show();
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

                    <Column dataField={ 'isActive' } caption={ 'Актив.' } width={ 50 } allowSorting={ false } hidingPriority={ 3 } />
                    <Column dataField={ 'email' } caption={ 'Почта' } width={ '90%' } allowSorting={ false } hidingPriority={ 4 }
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

                { administratorPopupTrigger
                    ? <AdministratorPopup
                        editMode={ editMode.current }
                        administrator={ currentAdministrator as AdministratorPopupModel }
                        callback={ async ({ modalResult }: {modalResult: string}) => {
                            setAdministratorPopupTrigger(false);
                            if(modalResult === DialogConstants.ModalResults.Ok) {
                                await updateDataAsync();
                            }
                        } }
                    />
                    : null
                }
                <DataGridMainContextMenu
                    ref={ mainContextMenuRef }
                    commands={
                        {
                            add: add,
                            refresh: updateDataAsync,
                            exportToXlsx: () => {
                                if (dxDataGridRef.current) {
                                    administratorExcelExporter({
                                        dataGrid: dxDataGridRef.current.instance as unknown as dxDataGrid<Entity, number>,
                                        title: 'Администраторы'
                                    });
                                }
                            }
                        }
                    }/>
                    <DataGridRowContextMenu
                        ref={ rowContextMenuRef }
                        commands={
                            {
                                edit: edit,
                                remove: remove,
                            }
                        }
                    />
            </>
        )
    }

    return (
        <>
            <PageHeader caption={ 'Администраторы' }>
                <AdminIcon size={ AppConstants.headerIconSize }/>
            </PageHeader>
            <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
        </>
    );
}

export default Administrators;
