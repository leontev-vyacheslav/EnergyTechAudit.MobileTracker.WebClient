import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppConstants from '../../constants/app-constants';
import { useAppData } from '../../contexts/app-data';
import DataGrid, { Column, Grouping, Pager, Paging, Scrolling, SearchPanel } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/ui/button';
import { AddressIcon, GridAdditionalMenuIcon, OrganizationIcon, WarningIcon } from '../../constants/app-icons';
import DataGridIconCellValueContainer from '../../components/data-grid-utils/data-grid-icon-cell-value-container';
import PageHeader from '../../components/page-header/page-header';
import OrganizationMainContextMenu from './organization-main-context-menu/organization-main-context-menu';
import OrganizationGroupRowContextMenu from './organization-group-row-context-menu/organization-group-row-context-menu';
import OrganizationRowContextMenu from './organization-row-context-menu/organization-row-context-menu';
import { Template } from 'devextreme-react/core/template';
import OrganizationPopup from './organization-popup/organization-popup';
import showConfirmDialog from '../../utils/confirm';


const Organizations = () => {
    const { getOfficesAsync, deleteOrganizationAsync, deleteOfficeAsync } = useAppData();

    const [organizations, setOrganizations] = useState(null);
    const [organizationPopupTrigger, setOrganizationPopupTrigger] = useState(false);

    const dxDataGridRef = useRef(null);
    const mainContextMenuRef = useRef();
    const groupRowContextMenuRef = useRef();
    const rowContextMenuRef = useRef();

    useEffect(() => {
        ( async () => {
            const organizations = await getOfficesAsync();
            setOrganizations(organizations);
        } )();
    }, [getOfficesAsync]);

    const onDataGridToolbarPreparing = useCallback((e) => {
        if (e?.toolbarOptions) {
            e.toolbarOptions.items.unshift(
                {
                    location: 'before',
                    template: 'DataGridToolbarButtonTemplate'
                }
            );
        }
    }, []);

    const addOrganization = useCallback(() => {
        setOrganizationPopupTrigger(true);
    }, [])

    const deleteOrganizationByIdAsync = useCallback(async () => {
        showConfirmDialog({
            title: 'Предупреждение',
            contentRender: () => {
                return (
                    <div style={ { display: 'flex', alignItems: 'center' } }>
                        <WarningIcon size={ 36 } style={ { color: '#ff5722' } }/>
                        <span style={ { marginLeft: 10 } }>Действительно хотите <b>удалить</b> организацию!</span>
                    </div>
                );
            }, callback: async () => {
                if (dxDataGridRef.current && dxDataGridRef.current.instance) {
                    const currentGroupRowKey = dxDataGridRef.current.instance.option('focusedRowKey');

                    const organization = organizations.find(md => md.organizationId === currentGroupRowKey[0]);
                    if (organization) {
                        await deleteOrganizationAsync(organization.organizationId)
                    }
                }
            }
        });
    }, [deleteOrganizationAsync, organizations]);

    const deleteOfficeByIdAsync = useCallback(async () => {

        showConfirmDialog({
            title: 'Предупреждение',
            contentRender: () => {
                return (
                    <div style={ { display: 'flex', alignItems: 'center' } }>
                        <WarningIcon size={ 36 } style={ { color: '#ff5722' } }/>
                        <span style={ { marginLeft: 10 } }>Действительно хотите <b>удалить</b> офис!</span>
                    </div>
                );
            }, callback: async () => {
                if (dxDataGridRef.current && dxDataGridRef.current.instance) {
                    const currentRowKey = dxDataGridRef.current.instance.option('focusedRowKey');
                    const organization = organizations.find(md => md.id === currentRowKey);
                    if (organization) {
                        await deleteOfficeAsync(organization.office.id);
                    }
                }
            }
        });
    }, [deleteOfficeAsync, organizations]);

    const GroupRowContent = ({ groupCell }) => {
        const items = groupCell.data.items === null ? groupCell.data.collapsedItems : groupCell.data.items;
        const groupDataItem = items[0];
        return (
            <>
                <div className={ 'user-grid-group mobile-devices-group' }>
                    <Button className={ 'time-line-command-button' } onClick={ (e) => {
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
                            return groupDataItem.description;
                        } }
                        iconRenderer={ (iconProps) => {
                            return <OrganizationIcon { ...iconProps } />;
                        } }
                    />
                </div>
            </> );
    }

    const DataGridToolbarButton = () => {
        return (
            <Button className={ 'time-line-command-button' } onClick={ (e) => {
                if (mainContextMenuRef && mainContextMenuRef.current) {
                    mainContextMenuRef.current.instance.option('target', e.element);
                    mainContextMenuRef.current.instance.show();
                }
            } }>
                <GridAdditionalMenuIcon/>
            </Button>
        );
    }

    if (!( organizations === null || organizations.length === 0 )) {
        return (
            <>
                <PageHeader caption={ 'Организации' }>
                    <OrganizationIcon size={ 30 }/>
                </PageHeader>
                <DataGrid ref={ dxDataGridRef }
                          keyExpr={ 'id' }
                          className={ 'app-grid mobile-devices dx-card wide-card' }
                          noDataText={ AppConstants.noDataLongText }
                          dataSource={ organizations }
                          showBorders={ false }
                          focusedRowEnabled={ true }
                          showColumnHeaders={ true }
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

                    <Template name={ 'DataGridToolbarButtonTemplate' } render={ DataGridToolbarButton }/>

                    <SearchPanel visible={ true } searchVisibleColumnsOnly={ false }/>
                    <Scrolling showScrollbar={ 'never' }/>
                    <Paging defaultPageSize={ 10 }/>
                    <Pager showPageSizeSelector={ true } showInfo={ true }/>
                    <Grouping autoExpandAll={ true } key={ 'organizationId' }/>

                    <Column type={ 'buttons' } width={ 50 } cellRender={ (e) => {
                        return e.data.office ?
                            <Button className={ 'time-line-command-button' } onClick={ (e) => {
                                if (rowContextMenuRef && rowContextMenuRef.current) {
                                    rowContextMenuRef.current.instance.option('target', e.element);
                                    rowContextMenuRef.current.instance.show();
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
                                    <DataGridIconCellValueContainer rowStyle={ { gridTemplateColumns: '25px 1fr' } }
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

                { organizationPopupTrigger ? <OrganizationPopup organizationId={ null } callback={ async (result) => {

                    if (result && result.modalResult === 'OK') {
                        //
                    }
                    setOrganizationPopupTrigger(false);
                } }/> : null }

                <OrganizationMainContextMenu
                    ref={ mainContextMenuRef }
                    commands={
                        {
                            addOrganization: addOrganization
                        }
                    }/>

                <OrganizationGroupRowContextMenu
                    ref={ groupRowContextMenuRef }
                    commands={
                        {
                            deleteOrganization: deleteOrganizationByIdAsync
                        }
                    }/>

                <OrganizationRowContextMenu
                    ref={ rowContextMenuRef }
                    commands={
                        {
                            deleteOffice: deleteOfficeByIdAsync
                        }
                    }/>
            </>
        );
    }

    return (
        <>
            <PageHeader caption={ 'Организации' }>
                <OrganizationIcon size={ 30 }/>
            </PageHeader>
            <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
        </>
    );
};

export default Organizations;
