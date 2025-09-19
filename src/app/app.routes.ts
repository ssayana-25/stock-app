import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'buy-model',
    loadComponent: () => import('./features/buy-model/buy-model.page').then( m => m.BuyModelPage)
  },
  {
    path: 'svg-icon',
    loadComponent: () => import('./shared/components/svg-icon/svg-icon.page').then( m => m.SvgIconPage)
  },
];
