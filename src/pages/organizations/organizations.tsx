import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppConstants from '../../constants/app-constants';
import { useAppData } from '../../contexts/app-data';
import DataGrid, {
    Column,
    Grouping,
    LoadPanel,
    Pager,
    Paging,
    Scrolling,
    SearchPanel
} from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import { AddressIcon, GridAdditionalMenuIcon, OrganizationIcon } from '../../constants/app-icons';
import DataGridIconCellValueContainer from '../../components/data-grid-utils/data-grid-icon-cell-value-container';
import PageHeader from '../../components/page-header/page-header';
import OrganizationGroupRowContextMenu from './organization-group-row-context-menu/organization-group-row-context-menu';
import OrganizationRowContextMenu from './organization-row-context-menu/organization-row-context-menu';
import { Template } from 'devextreme-react/core/template';
import OrganizationPopup from '../../components/popups/organization-popup/organization-popup';
import { showConfirmDialog } from '../../utils/dialogs';
import { useScreenSize } from '../../utils/media-query';
import OfficePopup from '../../components/popups/office-popup/office-popup';
import {
    DataGridToolbarButton,
    onDataGridToolbarPreparing
} from '../../components/data-grid-utils/data-grid-toolbar-button';
import { organizationsExcelExporter } from './organizations-excel-exporter';
import DataGridMainContextMenu from '../../components/data-grid-main-context-menu/data-grid-main-context-menu';
import { SimpleDialogModel } from '../../models/simple-dialog';
import ContextMenu from 'devextreme-react/context-menu';
import { OrganizationOfficesModel } from '../../models/organization-popup';
import { ContextMenuItemItemModel } from '../../models/context-menu-item-props';
import { Entity } from '../../models/entity';
import dxDataGrid from 'devextreme/ui/data_grid';

const Organizations = () => {
    const { getOrganizationOfficesAsync, deleteOrganizationAsync, deleteOfficeAsync } = useAppData();
    const { isXSmall } = useScreenSize();
    const [organizations, setOrganizations] = useState<OrganizationOfficesModel[] | null>(null);
    const [organizationPopupTrigger, setOrganizationPopupTrigger] = useState<boolean>(false);
    const [officePopupTrigger, setOfficePopupTrigger] = useState<boolean>(false);
    const [currentOrganization, setCurrentOrganization] = useState< OrganizationOfficesModel | null>(null);
    const editMode = useRef<boolean>(false);
    const dxDataGridRef = useRef<DataGrid<OrganizationOfficesModel, number>>(null);
    const mainContextMenuRef = useRef<ContextMenu<ContextMenuItemItemModel>>(null);
    const groupRowContextMenuRef = useRef<ContextMenu<ContextMenuItemItemModel>>(null);
    const rowContextMenuRef = useRef<ContextMenu<ContextMenuItemItemModel>>(null);

    const refreshAsync = useCallback(async () => {
        const organizationOffices = await getOrganizationOfficesAsync();
        setOrganizations(organizationOffices);
    }, [getOrganizationOfficesAsync]);

    useEffect(() => {
        ( async () => {
            await refreshAsync();
        } )();
    }, [getOrganizationOfficesAsync, refreshAsync]);

    const addOrganization = useCallback(() => {
        editMode.current = false;
        setCurrentOrganization(null);
        setOrganizationPopupTrigger(true);
    }, []);

    const editOrganization = useCallback(() => {
        if (dxDataGridRef.current && dxDataGridRef.current.instance) {
            const currentGroupRowKey = dxDataGridRef.current.instance.option('focusedRowKey');
            const organization = organizations?.find(org => org.organizationId === (currentGroupRowKey as any)[0]) ?? null;
            setCurrentOrganization(organization);
            editMode.current = true;
            setOrganizationPopupTrigger(true);
        }
    }, [organizations]);

    const deleteOrganizationByIdAsync = useCallback(async () => {
        showConfirmDialog({
            title: 'Предупреждение',
            iconName: 'WarningIcon',
            textRender: () => <>Действительно хотите <b>удалить</b> организацию!</>,
            callback: async () => {
                if (dxDataGridRef.current && dxDataGridRef.current.instance) {
                    const currentGroupRowKey = dxDataGridRef.current.instance.option('focusedRowKey') ;

                    if(organizations) {
                        const organization = organizations.find(md => md.organizationId === (currentGroupRowKey as any)[0]);
                        if (organization) {
                            await deleteOrganizationAsync(organization.organizationId);
                            await refreshAsync();
                        }
                    }
                }
            }
        } as SimpleDialogModel);
    }, [deleteOrganizationAsync, organizations, refreshAsync]);

    const addOffice = useCallback(() => {
        if (dxDataGridRef.current && dxDataGridRef.current.instance) {
            const currentGroupRowKey = dxDataGridRef.current.instance.option('focusedRowKey');
            if (organizations) {
                const organization = organizations.find(org => org.organizationId === (currentGroupRowKey as any)[0]) ?? null;
                setCurrentOrganization(organization);
            }
            editMode.current = false;
            setOfficePopupTrigger(true);
        }
    }, [organizations])

    const editOffice = useCallback(() => {
        if (dxDataGridRef.current && dxDataGridRef.current.instance) {
            const currentRowKey = dxDataGridRef.current.instance.option('focusedRowKey');
            if (organizations) {
                const organization = organizations.find(org => org.id === currentRowKey) ?? null;
                setCurrentOrganization(organization);
            }
            editMode.current = true;
            setOfficePopupTrigger(true);
        }
    }, [organizations])

    const deleteOfficeByIdAsync = useCallback(async () => {
        showConfirmDialog({
            title: 'Предупреждение',
            iconName: 'WarningIcon',
            textRender: () => <>Действительно хотите <b>удалить</b> офис!</>,
            callback: async () => {
                if (dxDataGridRef.current && dxDataGridRef.current.instance) {
                    const currentRowKey = dxDataGridRef.current.instance.option('focusedRowKey');
                    const organization = organizations?.find(md => md.id === currentRowKey);
                    if (organization && organization.office) {
                        await deleteOfficeAsync(organization.office.id);
                        await refreshAsync();
                    }
                }
            }
        } as SimpleDialogModel);
    }, [deleteOfficeAsync, organizations, refreshAsync]);

    const GroupRowContent = ({ groupCell }: any) => {
        const items = groupCell.data.items === null ? groupCell.data.collapsedItems : groupCell.data.items;
        const groupDataItem = items[0];
        return (
            <>
                <div className={ 'user-grid-group mobile-devices-group' }>
                    <Button className={ 'app-command-button app-command-button-small' } onClick={ async e => {
                        if (dxDataGridRef.current && dxDataGridRef.current.instance) {
                            dxDataGridRef.current.instance.option('focusedRowKey', groupCell.key);
                            e.event?.stopPropagation();
                            if (groupRowContextMenuRef && groupRowContextMenuRef.current) {
                                groupRowContextMenuRef.current.instance.option('target', e.element);
                                await groupRowContextMenuRef.current.instance.show();
                            }
                        }
                    } }>
                        <GridAdditionalMenuIcon/>
                    </Button>
                    <DataGridIconCellValueContainer
                        rowStyle={ { gridTemplateColumns: '25px 1fr' } }
                        cellDataFormatter={ () => {
                            return groupDataItem.description;
                        } }
                        iconRenderer={ (iconProps) => {
                            return <OrganizationIcon { ...iconProps } />;
                        } }
                    />
                </div>
            </> );
    }

    if (!( organizations === null || organizations.length === 0 )) {
        return (
            <>
                <PageHeader caption={ 'Организации' }>
                    <OrganizationIcon size={ AppConstants.headerIconSize }/>
                </PageHeader>
                <DataGrid
                    ref={ dxDataGridRef }
                    keyExpr={ 'id' }
                    className={ 'app-grid mobile-devices dx-card wide-card' }
                    noDataText={ AppConstants.noDataLongText }
                    dataSource={ organizations }
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
                    onRowPrepared={ async e => {
                        if (e.rowType === 'group' && e.data && (e.data as any).items) {
                            if ((e.data as any).items.find(() => true).office === null) {
                                const key = e.component.getKeyByRowIndex(e.rowIndex);
                                if (key) {
                                    await e.component.collapseRow(key);
                                }
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

                    <Column type={ 'buttons' } width={ 50 } cellRender={ (e) => {
                        return e.data.office ?
                            <Button className={ 'app-command-button app-command-button-small' } onClick={ async (e) => {
                                if (rowContextMenuRef && rowContextMenuRef.current) {
                                    rowContextMenuRef.current.instance.option('target', e.element);
                                    await rowContextMenuRef.current.instance.show();
                                }
                            } }>
                                <GridAdditionalMenuIcon/>
                            </Button>
                            : null
                    } }
                    />

                    <Column
                        dataField={ 'organizationId' }
                        groupIndex={ 0 }
                        groupCellRender={ (groupCell) => <GroupRowContent groupCell={ groupCell }/> }
                        visible={ false }
                    />

                    <Column dataField={ 'shortName' } visible={ false }/>
                    <Column dataField={ 'description' } visible={ false }/>

                    <Column dataField={ 'office.address' } caption={ 'Адрес' } width={ '100%' } allowSorting={ false } hidingPriority={ 4 }
                            cellRender={ (e) => {
                                return e.data.office ?
                                    <DataGridIconCellValueContainer
                                        rowStyle={ { gridTemplateColumns: '25px 1fr' } }
                                        cellDataFormatter={ () => {
                                            return e.data.office.address;
                                        } }
                                        iconRenderer={ (iconProps) => {
                                            return <AddressIcon { ...iconProps } />;
                                        } }
                                    />
                                    : null
                            } }
                    />
                </DataGrid>

                { organizationPopupTrigger ? <OrganizationPopup
                    editMode={ editMode.current }
                    organization={ currentOrganization }
                    callback={ async (result) => {
                        if (result && result.modalResult === 'OK') {
                            await refreshAsync();
                        }
                        setOrganizationPopupTrigger(false);
                    }
                 }/> : null }
                { officePopupTrigger && currentOrganization
                    ? <OfficePopup
                        editMode={ editMode.current }
                        organization={ currentOrganization }
                        callback={ async (result) => {
                            if (result && result.modalResult === 'OK') {
                                await refreshAsync();
                            }
                            setOfficePopupTrigger(false);
                        } }
                    />
                    : null
                }

                <DataGridMainContextMenu
                    ref={ mainContextMenuRef }
                    commands={
                        {
                            add: addOrganization,
                            refresh: refreshAsync,
                            exportToXlsx: () => {
                                if (dxDataGridRef.current) {
                                    organizationsExcelExporter({
                                        dataGrid: dxDataGridRef.current.instance as unknown as dxDataGrid<Entity, number>,
                                        title: 'Организации'
                                    });
                                }
                            }
                        }
                    }/>

                <OrganizationGroupRowContextMenu
                    ref={ groupRowContextMenuRef }
                    commands={
                        {
                            addOffice: addOffice,
                            editOrganization: editOrganization,
                            deleteOrganization: deleteOrganizationByIdAsync
                        }
                    }/>

                <OrganizationRowContextMenu
                    ref={ rowContextMenuRef }
                    commands={
                        {
                            editOffice: editOffice,
                            deleteOffice: deleteOfficeByIdAsync
                        }
                    }/>
            </>
        );
    }

    return (
        <>
            <PageHeader caption={ 'Организации' }>
                <OrganizationIcon size={ AppConstants.headerIconSize }/>
            </PageHeader>
            <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
        </>
    );
};

export default Organizations;
