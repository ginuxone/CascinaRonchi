import { Routes } from '@angular/router';

import { HomePage } from './pages/home.page';
import { NotFoundPage } from './pages/not-found.page';
import { PrivacyPage } from './pages/privacy.page';

export const routes: Routes = [
  { path: '', component: HomePage, pathMatch: 'full' },
  { path: 'privacy', component: PrivacyPage },
  { path: '**', component: NotFoundPage },
];
