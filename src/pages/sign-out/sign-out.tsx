import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { useAuth } from '../../contexts/auth';

const SignOut = () => {
    const { signOut } = useAuth();

    useEffect(() => {
        (async () => {
            await signOut();
        })();
    }, [signOut]);

    return (
        <Switch>
            <Route exact path='/logout'/>
        </Switch>
    );
}
export default SignOut;
