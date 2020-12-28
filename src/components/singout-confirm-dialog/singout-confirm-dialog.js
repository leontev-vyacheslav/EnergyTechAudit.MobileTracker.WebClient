import React from 'react';
import Popup from 'devextreme-react/popup';

const ConfirmDialog = (props) => {

    return (
        <Popup dragEnabled={ false }
               visible={ true }
               showTitle={ true }
               showCloseButton={ true }
               { ...props }
              >
            {props.children}
        </Popup>
    );
};
