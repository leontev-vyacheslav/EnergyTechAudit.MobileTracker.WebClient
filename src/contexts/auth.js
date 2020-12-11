import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';

import routes from '../constants/routes';
import { HttpConstants } from '../constants/http-constants';
import * as axios from 'axios';

function AuthProvider (props) {
    const [user, setUser] = useState();

    const getUserAuthDataFromStorageAsync = useCallback(async () => {
        let userAuthData = null;
        try {
            const userAuthDataStr = localStorage.getItem('@userAuthData');
            if (userAuthDataStr) {
                userAuthData = JSON.parse(userAuthDataStr);
            }
        } catch (error) {
            console.log(
                `The error has occurred during getting auth data object from the app storage: ${error.message}`,
            );
        }
        return userAuthData;
    }, []);

    const signIn = useCallback(async (email, password) => {
        let userAuthData = null;
        try {
            const response = await axios.get(
                `${routes.host}${routes.accountSignIn}?email=${email}&password=${password}`,
            );
            if (response && response.status === HttpConstants.StatusCodes.Ok && response.data) {
                userAuthData = response.data;
                if (userAuthData) {
                    localStorage.setItem('@userAuthData', JSON.stringify(userAuthData));
                }
            }
            setUser(userAuthData);
        } catch (error) {
            console.log(`The authentication process was failed with error: ${error.message}`);
            throw error;
        }
    }, []);

    const signOut = useCallback(async () => {
        const userAuthData = await getUserAuthDataFromStorageAsync();
        if (userAuthData) {
            try {
                await axios.post(`${routes.host}${routes.accountSignOut}`, userAuthData, {
                    headers: {
                        ...HttpConstants.Headers.ContentTypeJson,
                        Authentication: `Bearer ${userAuthData.token}`,
                    },
                });
            } catch (error) {
                console.log('It was happened error during a process of an user security token revoke!');
            }
        }
        localStorage.removeItem('@userAuthData');
        setUser(null);

    }, [getUserAuthDataFromStorageAsync]);

    useEffect(() => {
        ( async function () {
            const userAuthData = await getUserAuthDataFromStorageAsync();
            setUser(userAuthData);
        } )();
    }, [getUserAuthDataFromStorageAsync]);

    return (
        <AuthContext.Provider
            value={ { user, signIn, signOut, getUserAuthDataFromStorageAsync } }
            { ...props }
        />
    );
}

const AuthContext = createContext({});
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
