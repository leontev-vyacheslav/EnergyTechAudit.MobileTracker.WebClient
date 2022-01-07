const AppConstants = {
    appInfo: {
        companyName: 'Инженерный Центр Энерготехаудит©',
        title: 'Геолокация ЭТА24™',
    },

    noDataLongText: 'Нет данных для отображения',
    loadingDelay: 500,
    headerIconSize: 26,
    colors: {
        companyColor: '#2c394c',
        companyColorHighlight: '#e0e6eb',
        companyColorDarkHighlight: '#b1c1cd',
        companyMetroHover: '#0072C6',
        borderGreyColor: '#a3a3a3',
        themeBaseAccent: '#FF5722',
        baseDarkgreyTextColor: '#464646'
    },

    motionActivityTypeDictionary: [
        { id: 1, code: 'still', description: 'В покое' },
        { id: 2, code: 'walking', description: 'Прогулка' },
        { id: 3, code: 'on_foot', description: 'Ходьба' },
        { id: 4, code: 'running', description: 'Бег' },
        { id: 5, code: 'on_bicycle', description: 'Велосипед' },
        { id: 6, code: 'in_vehicle', description: 'Транспортное средство' },
        { id: 7, code: 'unknown', description: 'Неизвестен' },
        { id: 8, code: 'stationary', description: 'Cтационарность' },
    ],

    trackMap:{
        apiKey: 'AIzaSyBLE0ThOFO5aYYVrsDP8AIJUAVDCiTPiLQ',
        geocodeApiUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
        mapApiUrl: 'https://maps.googleapis.com/maps/api/js',
        libraries: ['geometry', 'places', 'visualization'],
        defaultZoom: 15,
        defaultTheme: [{ featureType: 'all', stylers: [{ saturation: 2.5 }, { gamma: 0.25 }] }],
        defaultCenter: { lng: 49.156374, lat: 55.796685 },

        polylineTrackPathStrokeWeight: 8,
        polylineTrackPathStrokeOpacity: 0.8,
        polylineTrackPathStrokeColor: '#FF5722',

        breakIntervalPathStrokeWeight: 8,
        breakIntervalPathStrokeOpacity: 0.8,
        breakIntervalPathStrokeColor: '#a52525',

        markerScale: 2.5,
        markerFillOpacity: 1,
        markerStrokeWeight: 0.8,
        markerFillColor: '#FF5722',
        markerStrokeColor: 'black',

        markerLabelFontSize: '11px',
        markerLabelColor: 'darkblue',
        markerLabelFontWeight: '600',

        stationaryCircleColor: '#2c394c',
        stationaryCircleStrokeOpacity:  0.6,
        stationaryCircleStrokeWeight: 1,
        stationaryCircleFillOpacity: 0.4
    }
};

export default AppConstants;
