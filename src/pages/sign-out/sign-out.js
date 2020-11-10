import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';

export default function () {
    const { signOut } = useAuth();

    useEffect(() => {
        signOut();
    }, [signOut]);

    return (
        <Switch>
            <Route exact path='/logout'/>
        </Switch>
    );
}
