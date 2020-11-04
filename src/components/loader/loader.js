import AppConstants from '../../constants/app-constants';
import LoadPanel from 'devextreme-react/load-panel';
import React, { Fragment } from 'react';
import { ReactComponent as ProgressGear } from '../../assets/Core.Common.ProgressGears.svg';

import './loader.scss';

const Loader = () => {
    return (
        <Fragment>
            <span className={ 'dx-datagrid-nodata' }>{ AppConstants.noDataLongText }</span>
            <LoadPanel
                visible={ true }
                position={ { of: 'body', offset: { x: 0, y: -50 } } }
                showPane={ true }
                shading={ true }
                width={ 200 } height={ 70 }
                maxWidth={ 200 } maxHeight={ 70 }
                shadingColor={'rgba(0, 0, 0, 0.15)'}>
                <ProgressGear/>
                <span>Загрузка...</span>
            </LoadPanel>
        </Fragment>
    );
};

export default Loader;
