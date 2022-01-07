import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';
import { AuthContextModel } from '../../models/auth-context';

export default function () {
    const { signOut }: AuthContextModel = useAuth();

    useEffect(() => {
        signOut();
    }, [signOut]);

    return (
        <Switch>
            <Route exact path='/logout'/>
        </Switch>
    );
}
