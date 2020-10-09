import { withNavigationWatcher } from './contexts/navigation';
import { HomePage, MobileDevicesPage, ProfilePage, AboutPage } from './pages';

const routes = [
  {
    path: '/mobileDevices',
    component: MobileDevicesPage
  },
  {
    path: '/profile',
    component: ProfilePage
  },
  {
    path: '/home',
    component: HomePage
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
