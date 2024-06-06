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
        path: 'customization',
        loadChildren: () => import('./customization/customization.module').then(m => m.CustomizationModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'navigation/breadcrumbs',
        loadChildren: () => import('./navigation/breadcrumbs/breadcrumbs.module').then(m => m.BreadcrumbsModule)
      },
      {
        path: 'navigation/tab-panel',
        loadChildren: () => import('./navigation/tab-panel/tab-panel.module').then(m => m.TabPanelModule)
      },
      {
        path: 'navigation/navigation',
        loadChildren: () => import('./navigation/navigation/navigation.module').then(m => m.NavigationModule)
      },
      {
        path: 'user-profile',
        loadChildren: () => import('./user-profile/user-profile.module').then(m => m.UserProfileModule)
      },
      {
        path: 'account/settings',
        loadChildren: () => import('./account/settings/settings.module').then(m => m.SettingsModule)
      },
      {
        path: 'pricing',
        loadChildren: () => import('./pricing/pricing.module').then(m => m.PricingModule)
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
