export const navigation = [
    {
        text: 'Главная',
        path: '/home',
        icon: 'home'
    },
    {
        text: 'Настройки',
        path: '/settings',
        icon: 'preferences'
    },
    {
        text: 'Устройства',
        icon: 'folder',
        items: [

            {
                text: 'Мобильные устройства',
                path: '/mobileDevices',
            }
        ]
    }, {
        text: 'Профиль',
        path: '/profile',
        icon: 'user'
    },
    {
        text: 'О программе',
        path: '/about',
        icon: 'info'
    }
];
