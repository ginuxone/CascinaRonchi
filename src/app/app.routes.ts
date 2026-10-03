import { Routes } from '@angular/router';

import { devRoutes } from './dev.routes';
import { HomePage } from './pages/home.page';
import { NotFoundPage } from './pages/not-found.page';
import { PrivacyPage } from './pages/privacy.page';

export const routes: Routes = [
  { path: '', component: HomePage, pathMatch: 'full' },
  { path: 'privacy', component: PrivacyPage },
  ...devRoutes,
  { path: '**', component: NotFoundPage },
];
