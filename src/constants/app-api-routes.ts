export default {
    host: process.env.NODE_ENV !== 'production' ? 'https://192.168.1.2:5001' : 'https://eta24.ru:15005',
    mobileDevice: '/api/mobileDevice',
    timeline: '/api/timeline',
    locationRecord: '/api/locationRecord',
    userManagement: '/api/userManagement',
    organization: '/api/organizations',
    administrator: '/api/administrator',

    accountSignIn: '/account/signIn',
    accountSignOut: '/account/signOut',
    accountAssignOrganization: '/account/assign-organization',
};
