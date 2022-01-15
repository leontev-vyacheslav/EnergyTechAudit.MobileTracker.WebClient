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
import { IconBaseProps } from 'react-icons/lib/cjs/iconBase';
import { TreeViewItemModel } from '../models/tree-view-item';

export const navigation: TreeViewItemModel[] = [
    {
        text: 'Главная',
        iconRender: (props: IconBaseProps) => <HomeIcon size={ 22 } { ...props } />,
        path: '/home',
        restricted: false,
    },
    {
        text: 'Списки',
        iconRender: (props: IconBaseProps) => <ListsIcon size={ 22 } { ...props } />,
        restricted: false,
        items: [
            {
                text: 'Организации',
                iconRender: (props: IconBaseProps) => <OrganizationIcon size={ 22 } { ...props } />,
                path: '/organizations',
                restricted: false
            },
            {
                text: 'Администраторы',
                iconRender: (props: IconBaseProps) => <AdminIcon size={ 22 } { ...props } />,
                path: '/administrators',
                restricted: false,
            },
            {
                text: 'Мобильные устройства',
                iconRender: (props: IconBaseProps) => <MobileDeviceIcon size={ 22 } { ...props } />,
                path: '/mobile-devices',
                restricted: false,
            },
        ]
    },
    {
        text: 'Настройки',
        iconRender: (props: IconBaseProps) => <SettingsIcon size={ 22 } { ...props } />,
        path: '/settings',
        restricted: false,
    },
    {
        text: 'Рабочая дата',
        iconRender: (props: IconBaseProps) => <WorkDateIcon size={ 22 } { ...props } />,
        command: 'workDate',
        restricted: false,
    },
    {
        text: 'Сегодня',
        iconRender: (props: IconBaseProps) => <WorkDateTodayIcon size={ 22 } { ...props } />,
        command: 'workDateToday',
        restricted: false,
    },
    {
        text: 'О программе',
        iconRender: (props: IconBaseProps) => <AboutIcon size={ 22 } { ...props } />,
        path: '/about',
        restricted: false,
    },
    {
        text: 'Выход',
        iconRender: (props: IconBaseProps) => <ExitIcon size={ 22 } { ...props } />,
        command: 'exit',
        restricted: false
    }
];
