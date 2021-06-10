import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from './constants/app-routes';
import { SideNavOuterToolbar as SideNavBarLayout } from './layouts';
import { Footer } from './components';
import AppConstants from './constants/app-constants';


import RegistrationPage from './pages/registration/registration';

const ContentAuth = () => {
    return (
        <>
            <SideNavBarLayout title={ AppConstants.appInfo.title }>
                <Switch>
                    { routes.map(({ path, component }) => (
                        <Route exact key={ path } path={ path } component={ component }/>
                    )) }
                    <Route exact={ false } key={ '/confirm-registration' } path={ '/confirm-registration' }>
                        <RegistrationPage/>
                    </Route>
                    <Route exact={ false } key={ '/reject-registration' } path={ '/reject-registration' }>
                        <RegistrationPage/>
                    </Route>
                    <Route path={ '*' }>
                        <Redirect from={ '/' } to={ '/home' }/>
                    </Route>
                </Switch>
                <Footer>
                    <div> Copyright © { new Date().getFullYear() } { AppConstants.appInfo.companyName }.</div>
                </Footer>track-map-header.js
            </SideNavBarLayout>
        </>
    );
}
export default ContentAuth;
