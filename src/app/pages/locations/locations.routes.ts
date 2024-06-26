import { Routes } from '@angular/router';
import { LocationsListComponent } from './list/list.component';
import { LocationDetailsComponent } from './location-details/location-details.component';


export const routes: Routes = [
  { path: '', component: LocationsListComponent },
  { path: ':locationId', component: LocationDetailsComponent },
];
