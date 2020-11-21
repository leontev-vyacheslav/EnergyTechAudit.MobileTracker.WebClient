import React from 'react';
import { useSharedArea } from '../../contexts/shared-area';
import { ReactComponent as ProgressGear } from '../../assets/Core.Common.ProgressGears.svg';
import LoadPanel from 'devextreme-react/load-panel';
import './loader.scss';

const Loader = () => {
    const { loaderRef } = useSharedArea();
    return (
        <LoadPanel
            ref={ loaderRef }
            position={ { of: 'body', offset: { x: 0, y: -50 } } }
            showPane={ true }
            shading={ true }
            width={ 200 } height={ 70 }
            maxWidth={ 200 } maxHeight={ 70 }
            shadingColor={ 'rgba(0, 0, 0, 0.15)' }>
            <ProgressGear/>
            <span>Загрузка...</span>
        </LoadPanel>
    );
};

export default Loader;
