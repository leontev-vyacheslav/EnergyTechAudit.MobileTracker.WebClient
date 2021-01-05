import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { SingleCard } from './layouts';
import { LoginForm } from './components';
import { RegistrationPage } from './pages/index';

export default function () {
    return (
        <Switch>
            <Route exact path="/login">
                <SingleCard title="Вход">
                    <LoginForm/>
                </SingleCard>
            </Route>
            <Route exact path={ ['/confirm-registration', '/reject-registration'] } component={ RegistrationPage }/>
            <Redirect to={ '/login' }/>
        </Switch>
    );
}
