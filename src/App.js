import ruMessages from 'devextreme/localization/messages/ru.json';
import { locale, loadMessages } from 'devextreme/localization';

import 'devextreme/dist/css/dx.common.css';
import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import './dx-styles.scss';
import { NavigationProvider } from './contexts/navigation';
import { AuthProvider, useAuth } from './contexts/auth';
import { useScreenSizeClass } from './utils/media-query';
import Content from './Content';
import NotAuthenticatedContent from './NotAuthenticatedContent';
import { AppSettingsProvider, useAppSettings } from './contexts/app-settings';
import { AppDataProvider } from './contexts/app-data';
import WorkDatePicker from './components/work-date-picker/work-date-picker';

function App () {
    const { user } = useAuth();

    loadMessages(ruMessages);
    locale(navigator.language);

    return user ? <Content/> : <NotAuthenticatedContent/>;
}

export default function Main () {
    const screenSizeClass = useScreenSizeClass();
    const { workDatePickerRef } = useAppSettings();
    return (
        <Router>
            <AppSettingsProvider>
                <AuthProvider>
                    <AppDataProvider>
                        <NavigationProvider>
                            <div className={ `app ${ screenSizeClass }` }>
                                <App/>
                                <WorkDatePicker ref={ workDatePickerRef }/>
                            </div>
                        </NavigationProvider>
                    </AppDataProvider>
                </AuthProvider>
            </AppSettingsProvider>
        </Router>
    );
}
