import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Category } from '@shared/models/category.model';
import { MovableItem, MovableItemInstance, MovableItemStatus } from '@shared/models/movable-items.model';
import { Room } from '@shared/models/room.model';
import { User } from '@shared/models/user.model';

import { Observable, of } from 'rxjs';
import { testItems } from './test-data';

export interface MovableItemWithDetails extends MovableItem {
  instancesCount: number;
  bookedBy: User[];
  takenBy: User[];
}

@Injectable()
export class ItemsDataService {
  constructor(private http: HttpClient) {}
  
  getItems(): Observable<MovableItemWithDetails[]> {
    return this.http.get<MovableItemWithDetails[]>(`${environment.apiUrl}/items`);
    // return of(testItems);
  }

  getItem(id: number): Observable<MovableItem> {
    return this.http.get<MovableItem>(`${environment.apiUrl}/items/${id}`);
    // return of (testItems.find(item => item.id === id)!);
  }

  getItemInstances(id: number): Observable<MovableItemInstance[]> {
    return this.http.get<MovableItemInstance[]>(`${environment.apiUrl}/items/${id}/instances`);
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`);
  }
  
  updateItem(id: number, value: MovableItem): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/items/${id}`, value);
  }

  createItem(value: MovableItem): Observable<MovableItem> {
    return this.http.post<MovableItem>(`${environment.apiUrl}/items`, value);
  }

  deleteItem(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/items/${id}`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(`${environment.apiUrl}/rooms`);
  }

  addInstance(itemId: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/items/${itemId}/instances`, {});
  }

  assignInstance(instanceId: number, userId: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/tracking/instances/${instanceId}`,
      { userId, status: MovableItemStatus.Taken });
  }

  unassignInstance(instanceId: number, roomId: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/tracking/instances/${instanceId}`,
      { roomId, status: MovableItemStatus.Available });
  }

  moveInstance(instanceId: number, roomId: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/tracking/instances/${instanceId}`,
      { roomId });
  }

  cancelBooking(instanceId: number): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/tracking/instances/${instanceId}`,
      { status: MovableItemStatus.Available });
  }
}