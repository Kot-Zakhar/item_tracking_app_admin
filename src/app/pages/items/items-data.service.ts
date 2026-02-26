import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CategoryWithChildren, CategoryWithDetails, CategoryWithDetailsAndChildren } from '@shared/models/category.model';
import { MovableItem, MovableItemInstance, MovableItemInstanceHistoryRecord, MovableItemStatus } from '@shared/models/movable-items.model';
import { Location, LocationWithDetails } from '@shared/models/location.model';
import { User, UserWithDetails } from '@shared/models/user.model';

import { Observable, map } from 'rxjs';
import { CollectionResult } from '@shared/models/request.model';

// TODO: Fix PascalCase
export interface UsersByStatus {
  Booked?: User[];
  Taken?: User[];
}

export interface MovableItemWithDetails extends MovableItem {
  totalAmount: number;
  usersByStatus: UsersByStatus;
}

export interface ItemsFilters extends ItemInstancesFilters {
  categories?: number[] | undefined;
  search?: string;
}

// TODO: Provide a way to select multiple locations on UI
export interface ItemInstancesFilters {
  location?: number;
  users?: number[];
}

@Injectable()
export class ItemsDataService {
  constructor(private http: HttpClient) {}
  
  getItems(filters: ItemsFilters): Observable<CollectionResult<MovableItemWithDetails>> {
    let params: any = {};
    if (filters.location) {
      params['locationIds'] = filters.location;
    }
    if (filters.categories?.length) {
      params['categoryIds'] = filters.categories;
    }
    if (filters.users) {
      params['userIds'] = filters.users;
    }
    if (filters.search) {
      params['search'] = filters.search;
    }
    return this.http.get<CollectionResult<MovableItemWithDetails>>(`${environment.apiUrl}/query/items`, { params });
  }

  getItem(id: string): Observable<MovableItem> {
    return this.http.get<MovableItem>(`${environment.apiUrl}/items/${id}`);
  }

  getItemInstances(id: string, filters: ItemInstancesFilters): Observable<MovableItemInstance[]> {
    let params: any = {};
    if (filters.location) {
      params['locationId'] = filters.location;
    }
    if (filters.users) {
      params['userIds'] = filters.users;
    }
    return this.http.get<CollectionResult<MovableItemInstance>>(`${environment.apiUrl}/items/${id}/instances`, { params })
      .pipe(map(result => result.payload));
  }

  getInstanceHistory(itemId: string, instanceId: number): Observable<MovableItemInstanceHistoryRecord[]> {
    return this.http.get<MovableItemInstanceHistoryRecord[]>(`${environment.apiUrl}/items/${itemId}/instances/${instanceId}/history`);
  }

  getInstanceQrCode(itemId: string, instanceId: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/items/${itemId}/instances/${instanceId}/qr`, { responseType: 'blob' });
  }

  getCategories(): Observable<CategoryWithChildren[]> {
    return this.http.get<CategoryWithDetails[]>(`${environment.apiUrl}/categories`);
  }
  
  updateItem(id: string, value: MovableItem): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/items/${id}`, value);
  }

  createItem(value: MovableItem): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/items`, value);
  }

  deleteItem(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/items/${id}`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  // TODO: Add pagination (only top N are returned by default)
  getUsers(): Observable<User[]> {
    return this.http.get<CollectionResult<UserWithDetails>>(`${environment.apiUrl}/users`)
      .pipe(map(result => result.payload));
  }

  // TODO: Add pagination (only top N are returned by default)
  getUserSuggestions(search: string | null): Observable<User[]> {
    let params: any = { top : 5 };
    if (search) {
      params['search'] = search;
    }
    return this.http.get<CollectionResult<UserWithDetails>>(`${environment.apiUrl}/query/users`, { params })
      .pipe(map(result => result.payload));
  }

  getLocation(id: number): Observable<Location> {
    return this.http.get<Location>(`${environment.apiUrl}/locations/${id}`);
  }

  // TODO: create a simple endpoint for locations
  getLocations(): Observable<CollectionResult<Location>> {
    return this.http.get<CollectionResult<LocationWithDetails>>(`${environment.apiUrl}/query/locations`);
  }

  // TODO: Add pagination (only top N are returned by default)
  getLocationSuggestions(search: string | null): Observable<Location[]> {
    let params: any = { top : 5, withItemsOnly: true };
    if (search) {
      params['search'] = search;
    }
    return this.http.get<CollectionResult<LocationWithDetails>>(`${environment.apiUrl}/query/locations`, { params })
      .pipe(map(result => result.payload));
  }

  addInstance(itemId: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/items/${itemId}/instances`, {});
  }

  assignInstance(itemId: string, instanceId: number, userId: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/management/items/${itemId}/instances/${instanceId}/assign`, { userId });
  }

  unassignInstance(itemId: string, instanceId: number, locationId: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/management/items/${itemId}/instances/${instanceId}/release`, { locationId });
  }

  moveInstance(itemId: string, instanceId: number, locationId: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/management/items/${itemId}/instances/${instanceId}/move`, { locationId });
  }

  cancelBooking(itemId: string, instanceId: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/management/items/${itemId}/instances/${instanceId}/cancel`, {});
  }

  deleteInstance(itemId: string, instanceId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/items/${itemId}/instances/${instanceId}`);
  }

  uploadFile(file: File): Observable<HttpEvent<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(`${environment.apiUrl}/files`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }
  
  deleteTmpFile(fileName: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/files/tmp/${fileName}`);
  }
}