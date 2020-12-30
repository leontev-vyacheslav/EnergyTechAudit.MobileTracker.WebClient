import { withNavigationWatcher } from './contexts/navigation';
import { HomePage, MobileDevicesPage, AboutPage, SettingsPage, SignOutPage, TrackSheetPage } from './pages';

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
