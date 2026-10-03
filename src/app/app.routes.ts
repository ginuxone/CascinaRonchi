import { isDevMode } from '@angular/core';
import { Routes } from '@angular/router';

import { HomePage } from './pages/home.page';
import { NotFoundPage } from './pages/not-found.page';
import { PrivacyPage } from './pages/privacy.page';

export const routes: Routes = [
  { path: '', component: HomePage, pathMatch: 'full' },
  { path: 'privacy', component: PrivacyPage },
  // Dev only: absent from production builds, so it is never prerendered or indexed.
  ...(isDevMode()
    ? [
        {
          path: 'style-guide',
          loadComponent: () =>
            import('./pages/style-guide/style-guide.page').then((m) => m.StyleGuidePage),
        },
      ]
    : []),
  { path: '**', component: NotFoundPage },
];
