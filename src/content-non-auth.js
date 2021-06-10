import React, { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { SingleCard } from './layouts';
import { LoginForm } from './components';
import Loader from './components/loader/loader';

const RegistrationPage = lazy(() => import('./pages/registration/registration'));

const ContentNonAuth = () => {
    return (
        <Switch>
            <Suspense fallback={ <Loader/> }>
                <Route exact path="/login">
                    <SingleCard title="Вход">
                        <LoginForm/>
                    </SingleCard>
                </Route>
                <Route exact={ false }  path={ '/confirm-registration' } >
                    <RegistrationPage />
                </Route>
                <Route exact={ false }  path={ '/reject-registration' } >
                    <RegistrationPage />
                </Route>
                <Route>
                    <Redirect from={ '/' } to={ '/login' } />
                </Route>
            </Suspense>
        </Switch>
    );
}

export default ContentNonAuth;
