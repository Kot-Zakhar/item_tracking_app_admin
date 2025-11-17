import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Location, LocationWithDetails } from '@shared/models/location.model';
import { MovableItemStatus, MovableItemWithInstances } from '@shared/models/movable-items.model';
import { CollectionResult } from '@shared/models/request.model';
import { User, UserEditable, UserWithDetails } from '@shared/models/user.model';
import { Observable, map } from 'rxjs';

@Injectable()
export class UsersDataService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<CollectionResult<UserWithDetails>> {
    return this.http.get<CollectionResult<UserWithDetails>>(`${environment.apiUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  updateUser(id: number, user: UserEditable): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/users/${id}`, user);
  }

  changePassword(id: number, passwords: any): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/users/${id}/password`, passwords);
  }

  createUser(user: any): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/users`, user);
  }
  
  deleteUser(id: number) {
    return this.http.delete<void>(`${environment.apiUrl}/users/${id}`);
  }


  // TODO: create a simple endpoint for locations
  getLocations(): Observable<Location[]> {
    return this.http.get<LocationWithDetails[]>(`${environment.apiUrl}/locations`);
  }

  unassignInstance(instanceId: number, locationId: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/tracking/instances/${instanceId}`,
      { locationId, status: MovableItemStatus.Available });
  }
}