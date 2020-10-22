import { refreshTokenAsync } from './auth';

export async function fetchWithCredentials (url, options) {
    const userAuthDataStr = localStorage.getItem('userAuthData');
    let userAuthData = null;
    if (userAuthDataStr) {
        userAuthData = JSON.parse(userAuthDataStr);
    }

    options = options || {};
    options.headers = options.headers || {};
    options.headers['Authorization'] = `Bearer ${ userAuthData.token }`;
    let response = await fetch(url, options).catch(e => {
        console.warn(e);
    });
    if (response.ok) {
        return response;
    }

    if (response.status === 401 && response.headers.has('Expires')) {

        const refreshResponse = await refreshTokenAsync(userAuthData.token, userAuthData.refreshToken);
        if (!refreshResponse.ok) {
            return response;
        }
        const jsonRefreshResponse = await refreshResponse.json();
        localStorage.setItem('userAuthData', JSON.stringify(jsonRefreshResponse));

        return await fetchWithCredentials(url, options);
    } else {
        return response;
    }

}
