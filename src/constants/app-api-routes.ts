export default {
    host: process.env.NODE_ENV !== 'production' ? 'https://localhost:5000' : 'xxxx',
    mobileDevice: '/api/mobile-devices',
    timeline: '/api/timelines',
    locationRecord: '/api/location-records',
    userManagement: '/api/user-management',
    organization: '/api/organizations',
    administrator: '/api/administrators',

    accountSignIn: '/account/sign-in',
    accountSignOut: '/account/sign-out',
    accountAssignOrganization: '/account/assign-organization',
};
