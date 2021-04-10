import { AboutIcon, ExitIcon, HomeIcon, ListsIcon, MobileDeviceIcon, OrganizationIcon, SettingsIcon, WorkDateIcon, WorkDateTodayIcon } from './app-icons';
import React from 'react';

export const navigation = [
    {
        text: 'Главная',
        icon: () => <HomeIcon size={ 22 }/>,
        path: '/home',
    },
    {
        text: 'Списки',
        icon: () => <ListsIcon size={ 22 }/>,
        items: [
            {
                text: 'Организации',
                icon: () => <OrganizationIcon size={ 22 }/>,
                path: '/organizations',
            },
            {
                text: 'Мобильные устройства',
                icon: () => <MobileDeviceIcon size={ 22 }/>,
                path: '/mobile-devices',
            },
        ]
    },
    {
        text: 'Настройки',
        icon: () => <SettingsIcon size={ 22 }/>,
        path: '/settings',
    },
    {
        text: 'Рабочая дата',
        icon: () => <WorkDateIcon size={ 22 }/>,
        command: 'workDate'
    },
    {
        text: 'Сегодня',
        icon: () => <WorkDateTodayIcon size={ 22 }/>,
        command: 'workDateToday'
    },
    {
        text: 'О программе',
        icon: () => <AboutIcon size={ 22 }/>,
        path: '/about',
    },
    {
        text: 'Выход',
        icon: () => <ExitIcon size={ 22 }/>,
        command: 'exit',
    }
];
