import { Routes } from '@angular/router';
import { ItemsListComponent } from './list/list.component';
import { ItemsItemInstancesComponent } from './item-instances/item-instances.component';
// import { ItemsInstanceHistoryComponent } from './instance-history/instance-history.component';

export const routes: Routes = [
  { path: '', component: ItemsListComponent },
  { path: ':itemId', component: ItemsItemInstancesComponent },
  // { path: ':itemId/:instanceId', component: ItemsInstanceHistoryComponent },
];
