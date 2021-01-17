import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { confirm } from 'devextreme/ui/dialog';

const showConfirmDialog = ({ title, contentRender, callback }) => {
    const content = ReactDOMServer.renderToString(
        React.createElement(
            contentRender,
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
