import { withNavigationWatcher } from '../contexts/navigation';
import { HomePage, MobileDevicesPage, TrackSheetPage, SettingsPage, TrackMapPage, AboutPage, SignOutPage, OrganizationsPage, AdministratorsPage } from '../pages';

/*
const AboutPage = lazy(() => import('../pages/about/about'));
const SignOutPage = lazy(() => import('../pages/sign-out/sign-out'));
const OrganizationsPage = lazy(() => import('../pages/organizations/organizations'));
const AdministratorsPage = lazy(() => import('../pages/administrators/administrators'));
*/

const routes = [
    {
        path: ['/home', '/'],
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
        path: '/administrators',
        component: AdministratorsPage,
    },
    {
        path: '/track-sheet',
        component: TrackSheetPage,
    },
    {
        path: '/track-map',
        component: TrackMapPage,
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
