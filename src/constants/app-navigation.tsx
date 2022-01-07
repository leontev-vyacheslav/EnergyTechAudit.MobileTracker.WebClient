import {
    AboutIcon,
    AdminIcon,
    ExitIcon,
    HomeIcon,
    ListsIcon,
    MobileDeviceIcon,
    OrganizationIcon,
    SettingsIcon,
    WorkDateIcon,
    WorkDateTodayIcon
} from './app-icons';
import React from 'react';

export const navigation = [
    {
        text: 'Главная',
        icon: () => <HomeIcon size={ 22 }/>,
        path: '/home',
        restricted: false,
    },
    {
        text: 'Списки',
        icon: () => <ListsIcon size={ 22 }/>,
        restricted: false,
        items: [
            {
                text: 'Организации',
                icon: () => <OrganizationIcon size={ 22 }/>,
                path: '/organizations',
                restricted: false
            },
            {
                text: 'Администраторы',
                icon: () => <AdminIcon size={ 22 }/>,
                path: '/administrators',
                restricted: false,
            },
            {
                text: 'Мобильные устройства',
                icon: () => <MobileDeviceIcon size={ 22 }/>,
                path: '/mobile-devices',
                restricted: false,
            },
        ]
    },
    {
        text: 'Настройки',
        icon: () => <SettingsIcon size={ 22 }/>,
        path: '/settings',
        restricted: false,
    },
    {
        text: 'Рабочая дата',
        icon: () => <WorkDateIcon size={ 22 }/>,
        command: 'workDate',
        restricted: false,
    },
    {
        text: 'Сегодня',
        icon: () => <WorkDateTodayIcon size={ 22 }/>,
        command: 'workDateToday',
        restricted: false,
    },
    {
        text: 'О программе',
        icon: () => <AboutIcon size={ 22 }/>,
        path: '/about',
        restricted: false,
    },
    {
        text: 'Выход',
        icon: () => <ExitIcon size={ 22 }/>,
        command: 'exit',
        restricted: false
    }
];
