import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { confirm, alert } from 'devextreme/ui/dialog';
import * as AppIcons from '../constants/app-icons';

const dialogContentRender = ({ iconName, iconSize, iconColor, textRender }) => {
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
const showConfirmDialog = ({ title, iconName, iconSize, iconColor, textRender, callback }) => {

    confirm(dialogContentRender({ iconName, iconSize, iconColor, textRender }), title).then((dialogResult) => {
        if (dialogResult) {
            if(callback && callback instanceof Function) {
                callback();
            }
        }
    });
}

const showAlertDialog = ({ title, iconName, iconSize, iconColor, textRender, callback }) => {
    alert(dialogContentRender({ iconName, iconSize, iconColor, textRender }), title).then((dialogResult) => {
        if (dialogResult) {
            if(callback && callback instanceof Function) {
                callback();
            }
        }
    });
};

export { showConfirmDialog, showAlertDialog };
