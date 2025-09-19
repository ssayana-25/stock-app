import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'home',
    component: TabsPage,
    children: [
      {
        path: 'invest',
        loadComponent: () =>
          import('../invest/invest.page').then((m) => m.InvestPage),
      },
      {
        path: 'discover',
        loadComponent: () =>
          import('../discover/discover.page').then((m) => m.DiscoverPage),
      },
      {
        path: '',
        redirectTo: '/home/invest',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/home/invest',
    pathMatch: 'full',
  },
];
