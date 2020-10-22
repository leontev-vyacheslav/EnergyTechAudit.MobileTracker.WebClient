const GOOGLE_API = 'https://maps.googleapis.com/maps/api/geocode/json';
let API_KEY = 'AIzaSyBLE0ThOFO5aYYVrsDP8AIJUAVDCiTPiLQ';
let LANGUAGE = 'ru';
let REGION = 'ru';

async function handleUrl(url) {
    const response = await fetch(url).catch(() =>
        Promise.reject(new Error('Error fetching data'))
    );

    const json = await response.json().catch(() => {
        console.log('Error parsing server response');
        return Promise.reject(new Error('Error parsing server response'));
    });

    if (json.status === 'OK') {
        return json;
    }
    console.log(
        `${json.error_message}.\nServer returned status code ${json.status}`,
        true
    );
    return Promise.reject(
        new Error(
            `${json.error_message}.\nServer returned status code ${json.status}`
        )
    );
}

export default {
    async fromLatLng (lat, lng, apiKey, language, region) {
        if (!lat || !lng) {
            console.log('Provided coordinates are invalid', true);
            return Promise.reject(new Error('Provided coordinates are invalid'));
        }

        const latLng = `${ lat },${ lng }`;
        let url = `${ GOOGLE_API }?latlng=${ encodeURIComponent(latLng) }`;

        if (apiKey || API_KEY) {
            API_KEY = apiKey || API_KEY;
            url += `&key=${ API_KEY }`;
        }

        if (language || LANGUAGE) {
            LANGUAGE = language || LANGUAGE;
            url += `&language=${ LANGUAGE }`;
        }

        if (region || REGION) {
            REGION = region || REGION;
            url += `&region=${ encodeURIComponent(REGION) }`;
        }

        return handleUrl(url);
    },

    async fromAddress(address, apiKey, language, region) {
        if (!address) {
            console.log('Provided address is invalid', true);
            return Promise.reject(new Error('Provided address is invalid'));
        }

        let url = `${GOOGLE_API}?address=${encodeURIComponent(address)}`;

        if (apiKey || API_KEY) {
            API_KEY = apiKey || API_KEY;
            url += `&key=${API_KEY}`;
        }

        if (language || LANGUAGE) {
            LANGUAGE = language || LANGUAGE;
            url += `&language=${LANGUAGE}`;
        }

        if (region || REGION) {
            REGION = region || REGION;
            url += `&region=${encodeURIComponent(REGION)}`;
        }

        return handleUrl(url);
    }
}
