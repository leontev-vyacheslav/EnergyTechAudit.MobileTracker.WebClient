import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

import appConstants from '../constants/app-constants';

function AuthProvider (props) {
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ( async function () {
            let userAuthData ;
            try {
                const userAuthDataStr = localStorage.getItem('userAuthData');
                if (userAuthDataStr) {
                    userAuthData = JSON.parse(userAuthDataStr);
                }
            }
            catch  {
                userAuthData = null;
            }
            setUser(userAuthData);
            setLoading(false);
        } )();
    }, []);

    const signIn = useCallback(async (userName, password) => {
        let userAuthData;
        try {
            const response = await fetch(`${ appConstants.routes.host }/account/login?userName=${ userName }&password=${ password }`, {
                method: 'GET',
            })
            if (response.ok === true) {
                userAuthData = await response.json();
            }
        } catch {
            userAuthData = null;
        }
        localStorage.setItem('userAuthData', JSON.stringify(userAuthData));
        setUser(userAuthData);
        return userAuthData;
    }, []);

    const signOut = useCallback(() => {

        localStorage.removeItem('userAuthData');
        setUser(null);
    }, []);

    const refreshTokenAsync = useCallback(async (token, refreshToken) => {
        return fetch(`${appConstants.routes.host}/account/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                refreshToken: refreshToken
            })
        });
    }, []);

    const revokeTokenAsync = useCallback(async (token) => {
        return await fetch(`${appConstants.routes.host}/account/revoke`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authentication: `Bearer ${ token }`
            }
        });
    }, []);

    return (
        <AuthContext.Provider value={ { user, signIn, signOut, refreshTokenAsync, loading } } { ...props } />
    );
}

const AuthContext = createContext({});
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth }
