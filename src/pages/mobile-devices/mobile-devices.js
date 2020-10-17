import React from 'react';
import CustomStore from 'devextreme/data/custom_store';
import Timelines from './timelines'
import { getMobileDevices } from '../../api/mobile-devices';
import appConstants from '../../constants/app-constants'
import { MdSmartphone } from 'react-icons/md';
import DataGrid, {
    Column,
    Pager,
    Paging,
    Grouping, MasterDetail,
} from 'devextreme-react/data-grid';

import './mobile-devices.scss';

export default () => (
    <React.Fragment>
        <h2 className={ 'content-block' }>Мобильные устройства</h2>
        <DataGrid
            className={ 'mobile-devices dx-card wide-card' }
            noDataText={ appConstants.noDataLongText }
            dataSource={ dataSource }
            showBorders={ false }
            focusedRowEnabled={ true }
            showColumnHeaders={ false }
            defaultFocusedRowIndex={ 0 }
            columnAutoWidth={ true }
            columnHidingEnabled={ true }
            onRowExpanding={ (e) => {
                e.component.collapseAll(-1);
            } }
        >
            <Paging defaultPageSize={ 10 }/>
            <Pager showPageSizeSelector={ true } showInfo={ true }/>

            <Grouping autoExpandAll={ true } key={ 'userId' }/>
            <Column type={ 'buttons' } width={ 50 } cellRender={ () => {

                return <MdSmartphone size={ 24 }/>
            } }/>
            <Column
                dataField={ 'id' }
                caption={ 'Ид' }
                width={ 30 }
                visible={ false }
                hidingPriority={ 2 }
            />
            <Column
                dataField={ 'userId' }
                groupIndex={ 0 }
                groupCellRender={ (template) => {
                    const items = template.data.items === null ? template.data.collapsedItems : template.data.items;
                    const groupDataItem = items[0];
                    return (
                        <div className={ 'mobile-devices-group' }>
                            <div className={ 'dx-icon dx-icon-user' }/>
                            <div>
                                <div>Пользователь: { groupDataItem.userName }</div>
                                <div>{ groupDataItem.email }</div>
                            </div>
                        </div>
                    );
                } }
                visible={ false }
            />
            <Column dataField={ 'deviceUid' } caption={ 'Уид устройства' } width={ 150 } allowSorting={ false } hidingPriority={ 3 }/>
            <Column dataField={ 'model' } caption={ 'Модель' } width={ 100 } allowSorting={ false } hidingPriority={ 4 }/>
            <Column dataField={ 'os' } caption={ 'ОС' } width={ 100 } allowSorting={ false } hidingPriority={ 2 }/>
            <Column dataField={ 'registrationDate' } caption={ 'Регистрация' } dataType={ 'datetime' } allowSorting={ false } hidingPriority={ 1 }/>
            <MasterDetail
                enabled={ true }
                render={ (e) => {
                    return <Timelines currentMobileDevice={ e.data }/>;
                } }
            />
        </DataGrid>
    </React.Fragment>
)
;

const dataSource = new CustomStore({
    key: 'id',
    load: () => {
        return getMobileDevices();
    }
});
