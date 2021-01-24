import { lazy } from 'react';

import { withNavigationWatcher } from '../contexts/navigation';
import { HomePage, MobileDevicesPage, TrackSheetPage } from '../pages';


const AboutPage = lazy(() => import('../pages/about/about'));
const SettingsPage = lazy(() => import('../pages/settings/settings'));
const SignOutPage = lazy(() => import('../pages/sign-out/sign-out'));
const OrganizationsPage = lazy(() => import('../pages/organizations/organizations'));

const routes = [
    {
        path: '/home',
        component: HomePage,
    },
    {
        path: '/settings',
        component: SettingsPage,
    },
    {
        path: '/mobile-devices',
        component: MobileDevicesPage,
    },
    {
        path: '/organizations',
        component: OrganizationsPage,
    },
    {
        path: '/track-sheet',
        component: TrackSheetPage,
    },
    {
        path: '/about',
        component: AboutPage,
    },
    {
        path: '/logout',
        component: SignOutPage,
    },
];

export default routes.map((route) => {
    return {
        ...route,
        component: withNavigationWatcher(route.component),
    };
});
