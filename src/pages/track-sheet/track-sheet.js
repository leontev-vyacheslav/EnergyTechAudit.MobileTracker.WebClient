import React, { useEffect, useRef, useState } from 'react';
import DataGrid, { Column, Grouping, MasterDetail, Pager, Paging, Scrolling } from 'devextreme-react/data-grid';
import { useAppData } from '../../contexts/app-data';
import AppConstants from '../../constants/app-constants'

import './track-sheet.scss';
import SideNavigationMenu from '../../components/side-navigation-menu/side-navigation-menu';
import { useParams } from 'react-router';
import { Button } from 'devextreme-react/ui/button';
import { MdMoreVert } from 'react-icons/md';
import Timelines from '../mobile-devices/timeline/timelines';
import  TrackSheetContextMenu from './track-sheet-context-menu'
import { useScreenSize } from '../../utils/media-query';

const TrackSheet = () => {
    const dxDataGridRef = useRef(null);
    const { isXSmall } = useScreenSize();
    const { getMobileDeviceAsync, getTrackSheetAsync } = useAppData();
    const [trackSheet, setTrackSheet] = useState(null);
    const [currentMobileDevice, setCurrentMobileDevice] = useState(null);
    const rowContextMenuRef = useRef();

    let { mobileDeviceId } = useParams();

    useEffect(() => {
        (async () => {
            const mobileDevice = await getMobileDeviceAsync(mobileDeviceId);
            setCurrentMobileDevice(mobileDevice);

            let trackSheet = await getTrackSheetAsync(mobileDeviceId) ?? [];
            trackSheet = trackSheet.map(ts => {
                return { ...ts, ...{ userId: mobileDevice.userId, mobileDeviceId: mobileDevice.id } }
            });
            console.log(trackSheet);
            console.log(mobileDevice);
            setTrackSheet(trackSheet);
        }) ();
    }, [getMobileDeviceAsync, getTrackSheetAsync, mobileDeviceId]);

    SideNavigationMenu.treeViewRef?.current?.instance.unselectAll();

    if ( trackSheet !== null && trackSheet.length !== 0 && currentMobileDevice ) {
        return (
            <>
                <h2 className={ 'content-block' }>Путевой отчет</h2>
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
                        dataField={ 'userId' }
                        groupIndex={ 0 }
                        groupCellRender={ () => {
                            return (
                                <div className={ 'mobile-devices-group' }>
                                    <div className={ 'dx-icon dx-icon-user' }/>
                                    <div><span style={ { marginRight: 10 } }>{ !isXSmall ? 'Пользователь:' : '' }</span>{ currentMobileDevice.email.toLowerCase() } / { currentMobileDevice.model }</div>
                                </div>
                            );
                        } }
                        visible={ false }
                    />
                    <Column type={ 'buttons' } width={ 50 } cellRender={ () => {
                        const buttonIconProps = { style: { cursor: 'pointer' }, size: 18, color: '#464646' };
                        return (
                            <Button className={ 'time-line-command-button' } onClick={ (e) => {
                                rowContextMenuRef.current.instance.option('target', e.element);
                                rowContextMenuRef.current.instance.show();
                            } }>
                                <MdMoreVert { ...buttonIconProps } />
                            </Button>
                        )
                    } }
                    />

                    <Column dataField={ 'id' } caption={ 'День' } width={ 60 } hidingPriority={ 2 }/>

                    <Column dataField={ 'date' } caption={ 'Дата' } width={ 100 } dataType={ 'date' } alignment={ 'left' } allowSorting={ false } hidingPriority={ 3 }/>

                    <Column dataField={ 'distance' } caption={ 'Расстояние' } width={ 100 } alignment={ 'left' } hidingPriority={ 4 }/>

                    <Column dataField={ 'samplesNumber' } caption={ 'Отсчеты' } alignment={ 'left' } hidingPriority={ 1 }/>

                    <MasterDetail
                        enabled={ true }
                        render={ (e) => {
                            return <Timelines currentMobileDevice={ currentMobileDevice } workDate={ e.data.date }/>;
                        } }
                    />
                </DataGrid>
                <TrackSheetContextMenu ref={ rowContextMenuRef } onShowTrackMapItemClick={ () => {
                    alert('Hi!');
                } }/>
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
