export default {
    host: process.env.NODE_ENV !== 'production' ? 'https://192.168.1.3:5001' : 'https://eta24.ru:15005',
    mobileDevice: '/api/mobileDevice',
    timeline: '/api/timeline',
    locationRecord: '/api/locationRecord',
    userManagement: '/api/userManagement',

    accountSignIn: '/account/signIn',
    accountSignOut: '/account/signOut',
};
