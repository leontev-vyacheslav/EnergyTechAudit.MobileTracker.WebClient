import React from 'react';
import CustomStore from 'devextreme/data/custom_store';
import TrackItems from './track-items'
import './mobile-devices.scss';

import DataGrid , {
    Column ,
    Pager ,
    Paging ,
    FilterRow ,
    Grouping , MasterDetail ,
} from 'devextreme-react/data-grid';

export default () => (
    <React.Fragment>
        <h2 className={ 'content-block' }>Мобильные устройства</h2>

        <DataGrid
            className={ 'dx-card wide-card' }
            dataSource={ dataSource }
            showBorders={ false }
            focusedRowEnabled={ true }
            defaultFocusedRowIndex={ 0 }
            columnAutoWidth={ true }
            columnHidingEnabled={ true }
        >
            <Paging defaultPageSize={ 10 }/>
            <Pager showPageSizeSelector={ true } showInfo={ true }/>
            <FilterRow visible={ true }/>
            <Grouping autoExpandAll={ true } key={ 'userId' }/>

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
                        <React.Fragment>
                            <div>Пользователь: { groupDataItem.userName }</div>
                            <div>{ groupDataItem.email }</div>
                        </React.Fragment>
                    );
                } }
                visible={ false }
            />
            <Column
                dataField={ 'deviceUid' }
                caption={ 'Уид устройства' }
                width={ 150 }
                allowSorting={ false }
                hidingPriority={ 3 }
            /><Column
            dataField={ 'model' }
            caption={ 'Модель' }
            width={ 100 }
            allowSorting={ false }
            hidingPriority={ 4 }
        />
            <Column
                dataField={ 'os' }
                caption={ 'ОС' }
                width={ 100 }
                allowSorting={ false }
                hidingPriority={ 2 }
            />
            <Column
                dataField={ 'registrationDate' }
                caption={ 'Регистрация' }
                dataType={ 'datetime' }
                allowSorting={ false }
                hidingPriority={ 1 }
            />
            <MasterDetail
                enabled={ true }
                component={ TrackItems }
            />
        </DataGrid>
    </React.Fragment>
);

const dataSource = new CustomStore({
    key: 'id' ,
    load: () => {
        return fetch('https://localhost:6001/api/mobileDevice' , {
            method: 'GET' ,
            headers: {
                Accept: 'application/json' ,
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiZXRhLm9wZXIubGVvIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiTU9CSUxFX0RFVklDRV9VU0VSIiwibmJmIjoxNjAyNDgzMTAyLCJleHAiOjE2MDI2NjMxMDIsImlzcyI6IkVuZXJneVRlY2hBdWRpdC5Nb2JpbGVUcmFja2VyLldlYiIsImF1ZCI6IkVuZXJneVRlY2hBdWRpdC5Nb2JpbGVUcmFja2VyLkNsaWVudCJ9._rUe4O4PxNB-rhckvKwVUG_C-2pRKEvQxffcA8KtTXY'
            } ,
        }).then(response => response.json());
    }
});
