export default {
    host: process.env.NODE_ENV !== 'production' ? 'https://192.168.1.5:6001' : 'https://eta24.ru:15005',
    mobileDevices: '/api/mobileDevice',
    timeline: '/api/timeline',
    locationRecord: '/api/locationRecord',
    accountLogin: '/account/signIn',
    accountRevoke: '/account/signOut',
};
