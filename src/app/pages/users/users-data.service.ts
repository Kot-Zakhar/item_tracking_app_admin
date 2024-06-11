import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { MovableItemWithInstances } from '@shared/models/movable-items.model';
import { User, UserEditable, UserWithDetails } from '@shared/models/user.model';
import { Observable } from 'rxjs';

@Injectable()
export class UsersDataService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserWithDetails[]> {
    return this.http.get<UserWithDetails[]>(`${environment.apiUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  getUserItems(id: number): Observable<MovableItemWithInstances[]> {
    return this.http.get<MovableItemWithInstances[]>(`${environment.apiUrl}/users/${id}/items`);
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
}