import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { SingleCard } from './layouts';
import { LoginForm } from './components';


import RegistrationPage from './pages/registration/registration';

const ContentNonAuth = () => {
    return (
        <Switch>
            <Route exact path="/login">
                <SingleCard title="Вход">
                    <LoginForm/>
                </SingleCard>
            </Route>
            <Route exact={ false } path={ '/confirm-registration' }>
                <RegistrationPage/>
            </Route>
            <Route exact={ false } path={ '/reject-registration' }>
                <RegistrationPage/>
            </Route>
            <Redirect to={ '/login' }/>
        </Switch>
    );
}

export default ContentNonAuth;
