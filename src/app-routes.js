import { withNavigationWatcher } from './contexts/navigation';
import { HomePage, MobileDevicesPage, ProfilePage, AboutPage, SettingsPage } from './pages';

const routes = [
  {
    path: '/home',
    component: HomePage
  },
  {
    path: '/settings',
    component:  SettingsPage
  },
  {
    path: '/mobileDevices',
    component: MobileDevicesPage
  },
  {
    path: '/profile',
    component: ProfilePage
  },

  {
    path: '/about',
    component: AboutPage
  }
];

export default routes.map(route => {
  return {
    ...route,
    component: withNavigationWatcher(route.component)
  };
});
