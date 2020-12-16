import React, { useEffect, useRef, useState } from 'react';
import DataGrid, { Column, Grouping, Pager, Paging, Scrolling } from 'devextreme-react/data-grid';
import { useAppData } from '../../contexts/app-data';
import AppConstants from '../../constants/app-constants'
/*import { useAppSettings } from '../../contexts/app-settings';
import { useScreenSize } from '../../utils/media-query';*/

import './track-sheet.scss';
import SideNavigationMenu from '../../components/side-navigation-menu/side-navigation-menu';
import { useParams } from 'react-router';

const TrackSheet = () => {
    const dxDataGridRef = useRef(null);
    /*const { isXSmall } = useScreenSize();
    const { appSettingsData } = useAppSettings();*/
    const { getTrackSheetAsync } = useAppData();
    const [trackSheet, setTrackSheet] = useState(null);
    let { mobileDeviceId } = useParams();

    useEffect(() => {
        (async () => {
            const trackSheet = await getTrackSheetAsync(mobileDeviceId) ?? [];
            setTrackSheet(trackSheet);
        }) ();
    }, [getTrackSheetAsync, mobileDeviceId]);

    SideNavigationMenu.treeViewRef?.current?.instance.unselectAll();

    if (!( trackSheet === null || trackSheet.length === 0 )) {
        return (
            <>
                <h2 className={ 'content-block' }>Мобильные устройства</h2>
                <DataGrid ref={ dxDataGridRef }
                          keyExpr={ 'id' }
                          className={ 'mobile-devices dx-card wide-card' }
                          noDataText={ AppConstants.noDataLongText }
                          dataSource={ trackSheet }
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

                    <Column
                        dataField={ 'id' }
                        caption={ 'Ид' }
                        width={ 30 }
                        visible={ false }
                        hidingPriority={ 2 }
                    />


                </DataGrid>
            </>
        );
    }

    return (
        <>
            <h2 className={ 'content-block' }>Путевой отчет</h2>
            <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
        </>
    );
};

export default TrackSheet;
