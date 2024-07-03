import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Category } from '@shared/models/category.model';
import { Location } from '@shared/models/location.model';
import { MovableItem } from '@shared/models/movable-items.model';
import { User } from '@shared/models/user.model';
import { Observable } from 'rxjs';

export interface GlobalSearchResult {
  items: MovableItem[];
  categories: Category[];
  locations: Location[];
  users: User[];
}

@Injectable()
export class GlobalSearchService {
  constructor(private http: HttpClient) {}

  search(query: string): Observable<GlobalSearchResult> {
    var params = {};
    if (query) {
      params = { q: query };
    }
    return this.http.get<GlobalSearchResult>(`${environment.apiUrl}/search`, { params });
  }
}