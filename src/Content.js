import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from './app-routes';
import { SideNavOuterToolbar as SideNavBarLayout } from './layouts';
import { Footer } from './components';
import AppConstants from './constants/app-constants';
import { RegistrationPage } from './pages/index';

export default function () {
    return (
        <>
            <SideNavBarLayout title={ AppConstants.appInfo.title }>
                <Switch>
                    { routes.map(({ path, component }) => (
                        <Route exact key={ path } path={ path } component={ component }/>
                    )) }
                    <Route exact path={ ['/confirm-registration', '/reject-registration'] } component={ RegistrationPage }/>
                    <Redirect to={ '/home' }/>
                </Switch>
                <Footer>
                    <div> Copyright © { new Date().getFullYear() } { AppConstants.appInfo.companyName }.</div>
                </Footer>
            </SideNavBarLayout>
        </>
    );
}
