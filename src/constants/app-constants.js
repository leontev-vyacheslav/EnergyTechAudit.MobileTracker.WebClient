const AppConstants = {
    noDataLongText: 'Нет данных для отображения',
    loadingDelay: 500,
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
    ]
};

export default AppConstants;
