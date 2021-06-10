import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { SingleCard } from './layouts';
import { LoginForm } from './components';
import Loader from './components/loader/loader';

const RegistrationPage = lazy(() => import('./pages/registration/registration'));

const ContentNonAuth = () => {
    // eslint-disable-next-line no-debugger
    debugger;
    return (
        <Switch>
            <Suspense fallback={ <Loader/> }>
                <Route exact path="/login">
                    <SingleCard title="Вход">
                        <LoginForm/>
                    </SingleCard>
                </Route>
                <Route exact={ false }  path={ ['/confirm-registration', '/reject-registration'] } component={ RegistrationPage }/>
                <Route path={ '*' }>
                    <Redirect to={ '/login' } />
                </Route>
            </Suspense>
        </Switch>
    );
}

export default ContentNonAuth;
