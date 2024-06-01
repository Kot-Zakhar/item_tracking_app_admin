import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) as T : null;
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }
}
