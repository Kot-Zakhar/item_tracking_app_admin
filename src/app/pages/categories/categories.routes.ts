import { Routes } from '@angular/router';
import { CategoriesListComponent } from './list/list.component';
import { CategoryDetailsComponent } from './category-details/category-details.component';

export const routes: Routes = [
  { path: '', component: CategoriesListComponent },
  { path: ':categoryId', component: CategoryDetailsComponent },
];
