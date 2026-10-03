import { Routes } from '@angular/router';

/** Development-only routes. Production builds swap this file for `dev.routes.prod.ts`. */
export const devRoutes: Routes = [
  {
    path: 'style-guide',
    loadComponent: () =>
      import('./pages/style-guide/style-guide.page').then((m) => m.StyleGuidePage),
  },
];
