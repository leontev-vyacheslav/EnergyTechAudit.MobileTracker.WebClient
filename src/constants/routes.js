export default {
    host: process.env.NODE_ENV !== 'production' ? 'https://localhost:6001' : 'https://eta24.ru:15005',
    mobileDevices: '/api/mobileDevice',
    timeline: '/api/timeline',
    locationRecord: '/api/locationRecord',
    accountLogin: '/account/login',
    accountRefresh: '/account/refresh',
    accountRevoke: '/account/revoke'
}
