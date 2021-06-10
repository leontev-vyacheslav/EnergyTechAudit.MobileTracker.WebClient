import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import routes from './constants/app-routes';
import { SideNavOuterToolbar as SideNavBarLayout } from './layouts';
import { Footer } from './components';
import AppConstants from './constants/app-constants';
import Loader from './components/loader/loader';

const RegistrationPage = lazy(() => import('./pages/registration/registration'));

const ContentAuth = () => {
    return (
        <>
            <SideNavBarLayout title={ AppConstants.appInfo.title }>
                <Switch>
                    <Suspense fallback={ <Loader/> }>
                        { routes.map(({ path, component }) => (
                            <Route exact key={ path } path={ path } component={ component }/>
                        )) }
                        <Route path={ ['/confirm-registration', '/reject-registration'] } component={ RegistrationPage }/>
                       <Redirect to={ '/home' } />
                    </Suspense>
                </Switch>
                <Footer>
                    <div> Copyright © { new Date().getFullYear() } { AppConstants.appInfo.companyName }.</div>
                </Footer>
            </SideNavBarLayout>
        </>
    );
}
export default ContentAuth;
