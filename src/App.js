import ruMessages from 'devextreme/localization/messages/ru.json';
import { locale, loadMessages } from 'devextreme/localization';

import 'devextreme/dist/css/dx.common.css';
import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import './dx-styles.scss';
import LoadPanel from 'devextreme-react/load-panel';
import { NavigationProvider } from './contexts/navigation';
import { AuthProvider, useAuth } from './contexts/auth';
import { useScreenSizeClass } from './utils/media-query';
import Content from './Content';
import NotAuthenticatedContent from './NotAuthenticatedContent';
import { AppSettingsProvider } from './contexts/app-settings';
import { AppDataProvider } from './contexts/app-data';

function App () {
    const { user, loading } = useAuth();
    loadMessages(ruMessages);
    locale(navigator.language);

    if (loading) {
        return <LoadPanel visible={ true }/>;
    }
    if (user) {
        return <Content/>;
    }
    return <NotAuthenticatedContent/>;
}

export default function () {
    const screenSizeClass = useScreenSizeClass();

    return (
        <Router>
            <AppSettingsProvider>
                <AuthProvider>
                    <AppDataProvider>
                        <NavigationProvider>
                            <div className={ `app ${ screenSizeClass }` }>
                                <App/>
                            </div>
                        </NavigationProvider>
                    </AppDataProvider>
                </AuthProvider>
            </AppSettingsProvider>
        </Router>
    );
}
