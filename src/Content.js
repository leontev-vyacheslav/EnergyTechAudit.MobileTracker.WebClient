import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import appInfo from './app-info';
import routes from './app-routes';
import { SideNavOuterToolbar as SideNavBarLayout } from './layouts';
import { Footer } from './components';

export default function () {
    return (
        <SideNavBarLayout title={ appInfo.title }>
            <Switch>
                { routes.map(({ path, component }) => (
                    <Route
                        exact
                        key={ path }
                        path={ path }
                        component={ component }
                    />
                )) }
                <Redirect to={ '/home' }/>
            </Switch>
            <Footer>
                Copyright © { new Date().getFullYear() } { appInfo.companyName }.
                <br/>
                <br/>
                Все товарные знаки или зарегистрированные товарные знаки являются собственностью соответствующих
                владельцев.
            </Footer>
        </SideNavBarLayout>
    );
}
