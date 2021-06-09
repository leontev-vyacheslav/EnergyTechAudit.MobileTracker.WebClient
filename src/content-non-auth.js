import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';
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
                <Route exact path={ ['/confirm-registration', '/reject-registration'] } component={ RegistrationPage }/>
                {/*<Redirect to={ '/login' }/>*/}
            </Suspense>
        </Switch>
    );
}

export default ContentNonAuth;
