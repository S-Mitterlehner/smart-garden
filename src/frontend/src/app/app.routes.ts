import { Routes } from '@angular/router';
import { BeetService } from './services/beet.service';

export const routes: Routes = [
  {
    path: 'beet/:id',
    providers: [BeetService],
    loadComponent: () =>
      import('./pages/beet-page/beet-page.component').then(
        (m) => m.BeetPageComponent
      ),
  },
];
