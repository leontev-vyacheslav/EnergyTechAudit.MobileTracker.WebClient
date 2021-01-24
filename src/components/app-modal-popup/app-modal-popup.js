import React from 'react';
import Popup from 'devextreme-react/popup';
import { useScreenSize } from '../../utils/media-query';
import { DialogConstants } from '../../constants/app-dialog-constant';

const AppModalPopup = ({ title,  children, onClose }) => {
    const { isXSmall, isSmall } = useScreenSize();
    return (
        <Popup className={ 'app-popup' } title={ title }
               dragEnabled={ true }
               visible={ true }
               showTitle={ true }
               showCloseButton={ true }
               onHiding={ () => onClose({ modalResult: DialogConstants.ModalResults.Close, parametric: null }) }
               width={ isXSmall || isSmall ? '95%' : '40%' }
               height={ isXSmall || isSmall ? '95%' : '450' }>
            { children }
        </Popup>
    )
}

export default  AppModalPopup;
