import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

import routes from '../constants/routes';

function AuthProvider (props) {
    const [user, setUser] = useState();

    const getUserAuthDataFromStorage = useCallback(() => {
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
        return userAuthData;
    }, []);

    const refreshTokenAsync = useCallback(async () => {
        const userAuthData = getUserAuthDataFromStorage();
        return fetch(`${routes.host}${routes.accountRefresh}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userAuthData)
        });
    }, [getUserAuthDataFromStorage]);

    const revokeTokenAsync = useCallback(async () => {
        const userAuthData = getUserAuthDataFromStorage();

        return await fetch(`${routes.host}${routes.accountRevoke}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authentication: `Bearer ${ userAuthData.token }`
            },
            body: JSON.stringify(userAuthData)
        });
    }, [getUserAuthDataFromStorage]);

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
        } )();
    }, []);

    const signIn = useCallback(async (userName, password) => {
        let userAuthData;
        try {
            const response = await fetch(`${ routes.host }${ routes.accountLogin }?userName=${ userName }&password=${ password }`, {
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

    const signOut = useCallback( () => {

        (async () => {
            await revokeTokenAsync();
        }) ();

        localStorage.removeItem('userAuthData');
        setUser(null);
    }, [revokeTokenAsync]);

    return (
        <AuthContext.Provider value={ { user, signIn, signOut, getUserAuthDataFromStorage, refreshTokenAsync } } { ...props } />
    );
}

const AuthContext = createContext({});
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth }
