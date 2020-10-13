import React from 'react';
import DataGrid, {
    Column
} from 'devextreme-react/ui/data-grid';

import './timeline-info.scss';

import appConstants from '../../constants/app-constants';
import DataSource from 'devextreme/data/data_source';
import ArrayStore from 'devextreme/data/array_store';

const TimelineInfo = ({ timeline }) => {
    return (
        <DataGrid
            className={'timeline-info'}
            width={ '100%' }
            noDataText={ appConstants.noDataLongText }
            dataSource = { new DataSource({
                store: new ArrayStore({
                    key: 'id',
                    data: timeline
                })
            }) }
            showBorders={ true }
            showColumnLines={ true }
            showRowLines={ true }
        >
            <Column dataField={ 'name' } caption={ 'Параметр' } width={ 250 }/>
            <Column dataField={ 'value' } caption={ 'Значение' } width={ 150 } alignment={ 'left' }/>
        </DataGrid>
    );
};

export default TimelineInfo;
