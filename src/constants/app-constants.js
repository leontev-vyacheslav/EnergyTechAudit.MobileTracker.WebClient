export default {
    routes: {
        host: process.env.NODE_ENV !== 'production' ? 'https://localhost:6001' : 'https://eta24.ru:15005',
        mobileDevices: '/api/mobileDevice',
        timeline: '/api/timeline',
        locationRecord: '/api/locationRecord'
    },
    noDataLongText: 'Нет данных для отображения',
    testToken : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiZXRhLm9wZXIubGVvIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiTU9CSUxFX0RFVklDRV9VU0VSIiwibmJmIjoxNjAyNzgxNzgxLCJleHAiOjE2MTE0MjE3ODEsImlzcyI6IkVuZXJneVRlY2hBdWRpdC5Nb2JpbGVUcmFja2VyLldlYkFwaSIsImF1ZCI6IkVuZXJneVRlY2hBdWRpdC5Nb2JpbGVUcmFja2VyLk1vYmlsZUNsaWVudCJ9.CgjPUoMjzWlitYqYHCmQM4kqGIngZiWLqKVDR3p6SBA'
};
