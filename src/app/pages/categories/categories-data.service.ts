import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Category, CategoryWithDetails, CategoryWithDetailsAndChildren } from '@shared/models/category.model';
import { Observable } from 'rxjs';

@Injectable()
export class CategoriesDataService {
  constructor(private http: HttpClient) {}
  
  getCategories(): Observable<CategoryWithDetailsAndChildren[]> {
    return this.http.get<CategoryWithDetailsAndChildren[]>(`${environment.apiUrl}/categories`);
  }

  getCategory(id: number): Observable<CategoryWithDetails> {
    return this.http.get<CategoryWithDetails>(`${environment.apiUrl}/categories/${id}`);
  }

  updateCategory(id: number, category: Category): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/categories/${id}`, category);
  }

  createCategory(category: Category): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/categories`, category);
  }

  deleteCategory(id: number) {
    return this.http.delete<void>(`${environment.apiUrl}/categories/${id}`);
  }
}