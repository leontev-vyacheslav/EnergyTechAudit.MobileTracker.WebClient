import React, { useEffect, useRef, useState } from 'react';
import AppConstants from '../../constants/app-constants';
import { useAppData } from '../../contexts/app-data';
import DataGrid, { Column, Grouping, Pager, Paging, Scrolling } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/ui/button';
import { AddressIcon, GridAdditionalMenuIcon, OrganizationIcon } from '../../utils/app-icons';
import DataGridIconCellValueContainer from '../../components/data-grid/data-grid-icon-cell-value-container';
import PageHeader from '../../components/page-header/page-header';

const Organizations = () => {
    const { getOfficesAsync } = useAppData();

    const [organizations, setOrganizations] = useState(null);
    const { dxDataGridRef } = useRef(null);
    const { rowContextMenuRef } = useRef(null);

    useEffect(() => {
        (async () => {
            const organizations = await getOfficesAsync();
            setOrganizations(organizations);
        })();
    }, [getOfficesAsync]);

    const GroupRowContent = ({ groupCell }) => {
        const items = groupCell.data.items === null ? groupCell.data.collapsedItems : groupCell.data.items;
        const groupDataItem = items[0];

        return <DataGridIconCellValueContainer
            rowStyle={ { gridTemplateColumns: '25px 1fr' } }
            cellDataFormatter={ () => {
                return groupDataItem.organizationShortName;
            } }
            iconRenderer={ (iconProps) => {
                return <OrganizationIcon { ...iconProps } />;
            } }
        />
    }

    if (!( organizations === null || organizations.length === 0 )) {
        return (
            <>
                <PageHeader caption={ 'Организации' }>
                    <OrganizationIcon size={ 30 }  />
                </PageHeader>
                <DataGrid ref={ dxDataGridRef }
                          keyExpr={ 'id' }
                          className={ 'mobile-devices dx-card wide-card' }
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
                >
                    <Scrolling showScrollbar={ 'never' }/>
                    <Paging defaultPageSize={ 10 }/>
                    <Pager showPageSizeSelector={ true } showInfo={ true }/>
                    <Grouping autoExpandAll={ true } key={ 'userId' }/>
                    <Column type={ 'buttons' } width={ 50 } cellRender={ () => {
                        return (
                            <Button className={ 'time-line-command-button' } onClick={ (e) => {
                                if(rowContextMenuRef) {
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
                        groupCellRender={ (groupCell) => <GroupRowContent groupCell={ groupCell }/>  }
                        visible={ false }
                    />

                    <Column dataField={ 'address' } caption={ 'Адрес' } width={ '100%' } allowSorting={ false } hidingPriority={ 4 }
                            cellRender={ (e) => {
                                return <DataGridIconCellValueContainer rowStyle={ { gridTemplateColumns: '25px 1fr' } }
                                    cellDataFormatter={ () => {
                                        return e.data.address;
                                    } }
                                    iconRenderer={ (iconProps) => {
                                        return <AddressIcon { ...iconProps } />;
                                    } }
                                />
                            } }
                    />
                </DataGrid>
            </>
        );
    }

    return (
        <>
            <PageHeader caption={ 'Организации' }>
                <OrganizationIcon size={ 30 }  />
            </PageHeader>
            <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
        </>
    );
};

export default Organizations;
