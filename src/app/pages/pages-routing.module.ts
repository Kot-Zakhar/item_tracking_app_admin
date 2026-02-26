import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./common/common.component').then(c => c.CommonComponent),
    children: [
      {
        path: 'items',
        loadChildren: () => import('./items/items.routes').then(m => m.routes),
      },
      {
        path: 'categories',
        loadChildren: () => import('./categories/categories.routes').then(m => m.routes),
      },
      {
        path: 'locations',
        loadChildren: () => import('./locations/locations.routes').then(m => m.routes),
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.routes').then(m => m.routes),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'items'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
