import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { alert, confirm } from 'devextreme/ui/dialog';
import * as AppIcons from '../constants/app-icons';
import { SimpleDialogContentModel, SimpleDialogModel } from '../models/simple-dialog';

const dialogContentRender = ({ iconName, iconSize, iconColor, textRender }: SimpleDialogContentModel) => {
    return ReactDOMServer.renderToString(
        React.createElement(
            () =>
                <div style={ { display: 'flex', alignItems: 'center' } }>
                    { React.createElement(AppIcons[iconName], { size: iconSize ? iconSize : 36, style: { color: iconColor ? iconColor : '#ff5722' } }) }
                    <span style={ { marginLeft: 10 } }>{ textRender() }</span>
                </div>,
            {}
        )
    );
}

const showConfirmDialog = ({ title, iconName, iconSize, iconColor, textRender, callback } : SimpleDialogModel) => {

    confirm(dialogContentRender({ iconName, iconSize, iconColor, textRender }), title).then((dialogResult) => {
        if (dialogResult) {
            if(callback) {
                callback();
            }
        }
    });
}

const showAlertDialog = ({ title, iconName, iconSize, iconColor, textRender, callback }: SimpleDialogModel) => {
    alert(dialogContentRender({ iconName, iconSize, iconColor, textRender }), title).then(() => {
        if (callback) {
            callback();
        }
    });
};

export { showConfirmDialog, showAlertDialog };
