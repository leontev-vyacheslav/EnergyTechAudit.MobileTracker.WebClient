import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import routes from '../constants/app-api-routes';
import { HttpConstants } from '../constants/app-http-constants';
import axios from 'axios';
import {
    AuthContextModel,
    GetUserAuthDataFromStorageFunc,
    SignInAsyncFunc,
    SignOutAsyncFunc,
    AuthUserModel
} from '../models/auth-context';
import { AppBaseProviderProps } from '../models/app-base-provider-props';

const AuthContext = createContext<AuthContextModel>({ } as AuthContextModel);
const useAuth = () => useContext(AuthContext);

function AuthProvider (props: AppBaseProviderProps) {
    const [user, setUser] = useState<AuthUserModel | null>(null);

    const getUserAuthDataFromStorage = useCallback<GetUserAuthDataFromStorageFunc>( () => {
        let userAuthData = null;
        try {
            const userAuthDataStr = localStorage.getItem('@userAuthData');
            if (userAuthDataStr) {
                userAuthData = JSON.parse(userAuthDataStr);
            }
        } catch (error) {
            console.log(
                `The error has occurred during getting auth data object from the app storage: ${(error as Error).message}`,
            );
        }
        return userAuthData;
    }, []);

    useEffect(() => {
        const userAuthData = getUserAuthDataFromStorage();
        setUser(userAuthData);
    }, [getUserAuthDataFromStorage]);

    const signIn = useCallback<SignInAsyncFunc>(async (email: string, password: string) => {
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
            console.log(`The authentication process was failed with error: ${(error as Error).message}`);
            throw error;
        }
    }, []);

    const signOut = useCallback<SignOutAsyncFunc>(async () => {
        const userAuthData = getUserAuthDataFromStorage();
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

    }, [getUserAuthDataFromStorage]);

    return (
        <AuthContext.Provider
            value={ { user, signIn, signOut, getUserAuthDataFromStorage } }
            { ...props }
        />
    );
}

export { AuthProvider, useAuth };
