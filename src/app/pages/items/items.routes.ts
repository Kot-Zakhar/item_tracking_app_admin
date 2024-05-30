import { Routes } from '@angular/router';
import { ItemsListComponent } from './list/list.component';
import { ItemsItemDetailsComponent } from './item-details/item-details.component';
// import { ItemsInstanceHistoryComponent } from './instance-history/instance-history.component';

export const routes: Routes = [
  { path: '', component: ItemsListComponent },
  { path: ':itemId', component: ItemsItemDetailsComponent },
  // { path: ':itemId/:instanceId', component: ItemsInstanceHistoryComponent },
];
