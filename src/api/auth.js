import appConstants from '../constants/app-constants'

export async function refreshTokenAsync (jwtToken, refreshToken) {
    return fetch(`${appConstants.routes.host}/token/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token: jwtToken,
            refreshToken: refreshToken
        })
    });
}

export async function signInAsync (userName, password) {
    try {
        const response = await fetch(`${ appConstants.routes.host }/account/login?userName=${userName}&password=${password}`, {
            method: 'GET',
        })
        if(response.ok === true)
        {
            const userAuthData = await response.json();
            localStorage.setItem('userAuthData', JSON.stringify(userAuthData));
            return userAuthData;
        }
    } catch {
        return null;
    }
}

export async function getUser () {
    try {
        let userAuthData = null;
        const userAuthDataStr = localStorage.getItem('userAuthData');
        if(userAuthDataStr) {
            userAuthData = JSON.parse(userAuthDataStr);
        }
        return userAuthData;
    } catch {
        return null;
    }
}

export async function createAccount (email, password) {
    try {
        // Send request
        console.log(email, password);

        return {
            isOk: true
        };
    } catch {
        return {
            isOk: false,
            message: 'Failed to create account'
        };
    }
}



