import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { confirm } from 'devextreme/ui/dialog';
import * as AppIcons from '../constants/app-icons';

const showConfirmDialog = ({ title, appIconName, textRender, callback }) => {
    const content = ReactDOMServer.renderToString(
        React.createElement(
            () =>
                <div style={ { display: 'flex', alignItems: 'center' } }>
                    { React.createElement(AppIcons[appIconName], { size: 36, style: { color: '#ff5722' } }) }
                    <span style={ { marginLeft: 10 } }>{textRender()}</span>
                </div>,
            {}
        )
    );
    confirm(content, title).then((dialogResult) => {
        if (dialogResult) {
            callback();
        }
    });
}


export default showConfirmDialog;
