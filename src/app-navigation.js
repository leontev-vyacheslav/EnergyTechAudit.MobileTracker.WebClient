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
        text: 'О программе',
        path: '/about',
        icon: 'info'
    }
];
