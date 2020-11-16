const AppConstants = {
    noDataLongText: 'Нет данных для отображения',
    loadingDelay: 500,
    colors: {
        companyColor: '#2c394c',
        companyColorHighlight: '#e0e6eb',
        companyColorDarkHighlight: '#b1c1cd',
        companyMetroHover: '#0072C6',
        borderGreyColor: '#a3a3a3',
        themeBaseAccent: '#FF5722'
    },

    fullTimeFormat: { hour: '2-digit', minute: '2-digit', second: '2-digit' },
    shortTimeFormat: { hour: '2-digit', minute: '2-digit' },
    motionActivityTypeDictionary: [
        { id: 1, code: 'still', description: 'В покое' },
        { id: 2, code: 'walking', description: 'Прогулка' },
        { id: 3, code: 'on_foot', description: 'Ходьба' },
        { id: 4, code: 'running', description: 'Бег' },
        { id: 5, code: 'on_bicycle', description: 'Велосипед' },
        { id: 6, code: 'in_vehicle', description: 'Транспортное средство' },
        { id: 7, code: 'unknown', description: 'Неизвестен' }
    ],
    trackMap:{
        apiKey: 'AIzaSyBLE0ThOFO5aYYVrsDP8AIJUAVDCiTPiLQ',
        libraries: ['geometry'],
        defaultZoom: 15,
        defaultTheme: [{ featureType: 'all', stylers: [{ saturation: 2.5 }, { gamma: 0.25 }] }],
        defaultCenter: { lng: 49.156374, lat: 55.796685 },

        polylineTrackPathStrokeWeight: 8,
        polylineTrackPathStrokeOpacity: 0.8,
        polylineTrackPathStrokeColor: '#FF5722',

        breakIntervalPathStrokeWeight: 8,
        breakIntervalPathStrokeOpacity: 0.8,
        breakIntervalPathStrokeColor: '#2c394c',

        markerScale: 2.5,
        markerFillOpacity: 1,
        markerStrokeWeight: 0.8,
        markerFillColor: '#FF5722',
        markerStrokeColor: 'black',
    }
};

export default AppConstants;
