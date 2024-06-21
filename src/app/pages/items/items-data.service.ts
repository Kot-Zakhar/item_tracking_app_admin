import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CategoryWithChildren, CategoryWithDetails, CategoryWithDetailsAndChildren } from '@shared/models/category.model';
import { MovableItem, MovableItemInstance, MovableItemInstanceHistoryRecord, MovableItemStatus } from '@shared/models/movable-items.model';
import { Location, LocationWithDetails } from '@shared/models/location.model';
import { User, UserWithDetails } from '@shared/models/user.model';

import { Observable, map } from 'rxjs';

export interface MovableItemWithDetails extends MovableItem {
  instancesCount: number;
  bookedBy: User[];
  takenBy: User[];
}

export interface ItemsFilters extends ItemInstancesFilters {
  category?: number;
  search?: string;
}

export interface ItemInstancesFilters {
  location?: number;
  users?: number[];
}

@Injectable()
export class ItemsDataService {
  constructor(private http: HttpClient) {}
  
  getItems(filters: ItemsFilters): Observable<MovableItemWithDetails[]> {
    let params: any = {};
    if (filters.location) {
      params['locationId'] = filters.location;
    }
    if (filters.category) {
      params['categoryId'] = filters.category;
    }
    if (filters.users) {
      params['userIds'] = filters.users;
    }
    if (filters.search) {
      params['search'] = filters.search;
    }
    return this.http.get<MovableItemWithDetails[]>(`${environment.apiUrl}/items`, { params });
  }

  getItem(id: number): Observable<MovableItem> {
    return this.http.get<MovableItem>(`${environment.apiUrl}/items/${id}`);
  }

  getItemInstances(id: number, filters: ItemInstancesFilters): Observable<MovableItemInstance[]> {
    let params: any = {};
    if (filters.location) {
      params['locationId'] = filters.location;
    }
    if (filters.users) {
      params['userIds'] = filters.users;
    }
    return this.http.get<MovableItemInstance[]>(`${environment.apiUrl}/items/${id}/instances`, { params });
  }

  getInstanceHistory(itemId: number, instanceId: number): Observable<MovableItemInstanceHistoryRecord[]> {
    return this.http.get<MovableItemInstanceHistoryRecord[]>(`${environment.apiUrl}/items/${itemId}/instances/${instanceId}/history`);
  }

  // Beware, this mapper brakes the original tree
  private mapper(categoriesWithDetails: CategoryWithDetailsAndChildren[]): CategoryWithChildren[] {
    return categoriesWithDetails.map(details => {
      var categoryWithChildren: CategoryWithChildren = details.category;
      if (details.children)
        categoryWithChildren.children = this.mapper(details.children);
      return categoryWithChildren
    });
  }

  // TODO: This is not right.
  // A new endpoint should be created to get the categories with children without additional data.
  getCategories(): Observable<CategoryWithChildren[]> {
    return this.http.get<CategoryWithDetails[]>(`${environment.apiUrl}/categories`)
      .pipe(map(details => this.mapper(details)));
  }
  
  updateItem(id: number, value: MovableItem): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/items/${id}`, value);
  }

  createItem(value: MovableItem): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/items`, value);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/items/${id}`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getUserSuggestions(search: string | null): Observable<User[]> {
    let params: any = { top : 5 };
    if (search) {
      params['search'] = search;
    }
    return this.http.get<UserWithDetails[]>(`${environment.apiUrl}/users`, { params })
      .pipe(map(users => users.map(u => u.user)));
  }

  getLocation(id: number): Observable<Location> {
    return this.http.get<Location>(`${environment.apiUrl}/locations/${id}`);
  }

  // TODO: create a simple endpoint for locations
  getLocations(): Observable<Location[]> {
    return this.http.get<LocationWithDetails[]>(`${environment.apiUrl}/locations`)
      .pipe(map(locations => locations.map(l => l.location)));
  }

  getLocationSuggestions(search: string | null): Observable<Location[]> {
    let params: any = { top : 5, withItemsOnly: true };
    if (search) {
      params['search'] = search;
    }
    return this.http.get<LocationWithDetails[]>(`${environment.apiUrl}/locations`, { params })
      .pipe(map(locations => locations.map(l => l.location)));
  }

  addInstance(itemId: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/items/${itemId}/instances`, {});
  }

  assignInstance(instanceId: number, userId: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/tracking/instances/${instanceId}`,
      { userId, status: MovableItemStatus.Taken });
  }

  unassignInstance(instanceId: number, locationId: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/tracking/instances/${instanceId}`,
      { locationId, status: MovableItemStatus.Available });
  }

  moveInstance(instanceId: number, locationId: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/tracking/instances/${instanceId}`,
      { locationId });
  }

  deleteInstance(itemId:number, instanceId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/items/${itemId}/instances/${instanceId}`);
  }

  cancelBooking(instanceId: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/tracking/instances/${instanceId}`,
      { status: MovableItemStatus.Available });
  }

  uploadFile(file: File): Observable<HttpEvent<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${environment.apiUrl}/files`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
  
  deleteFile(src: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}${src}`);
  }
}