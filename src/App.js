import 'devextreme/dist/css/dx.common.css';
import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';
import './dx-styles.scss';
import  './styles/popup.scss';
import  './styles/badges.scss';

import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import { NavigationProvider } from './contexts/navigation';
import { AuthProvider, useAuth } from './contexts/auth';
import { useScreenSizeClass } from './utils/media-query';
import Content from './Content';
import NotAuthenticatedContent from './NotAuthenticatedContent';
import { AppSettingsProvider } from './contexts/app-settings';
import { AppDataProvider } from './contexts/app-data';
import { SharedAreaProvider } from './contexts/shared-area';

import ruMessages from 'devextreme/localization/messages/ru.json';
import { locale, loadMessages } from 'devextreme/localization';

function App () {
    const { user } = useAuth();

    loadMessages(ruMessages);
    locale(navigator.language);

    return user ?
        <Content/>
        : <NotAuthenticatedContent/>;
}

export default function Main () {
    const screenSizeClass = useScreenSizeClass();
    return (
        <Router>
            <AppSettingsProvider>
                <AuthProvider>
                    <SharedAreaProvider>
                            <AppDataProvider>
                                <NavigationProvider>
                                    <div className={ `app ${ screenSizeClass }` }>
                                        <App/>
                                    </div>
                                </NavigationProvider>
                            </AppDataProvider>
                    </SharedAreaProvider>
                </AuthProvider>
            </AppSettingsProvider>
        </Router>
    );
}
