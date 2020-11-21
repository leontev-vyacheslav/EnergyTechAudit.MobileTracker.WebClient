export const navigation = [
    {
        text: 'Главная',
        path: '/home',
        icon: 'home'
    },
    {
        text: 'Списки',
        icon: 'folder',
        items: [

            {
                text: 'Мобильные устройства',
                path: '/mobileDevices',
            }
        ]
    },
    {
        text: 'Рабочая дата',
        icon: 'event',
        command: 'workDate'
    },
    {
        text: 'Настройки',
        path: '/settings',
        icon: 'preferences'
    },
    {
        text: 'О программе',
        path: '/about',
        icon: 'info'
    },
    {
        text: 'Выход',
        command: 'exit',
        icon: 'runner'
    }
];
