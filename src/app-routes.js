import { withNavigationWatcher } from './contexts/navigation';
import { HomePage, MobileDevicesPage, ProfilePage, AboutPage, SettingsPage, SignOutPage, TrackSheetPage } from './pages';

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
        path: '/mobileDevices',
        component: MobileDevicesPage,
    },
    {
        path: '/trackSheet/:mobileDeviceId',
        component: TrackSheetPage,
    },
    {
        path: '/profile',
        component: ProfilePage,
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
