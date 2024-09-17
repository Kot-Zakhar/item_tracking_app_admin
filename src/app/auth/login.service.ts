import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { authApi } from './auth.constants';

export interface AuthResponse {
  accessToken: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  protected readonly http = inject(HttpClient);
  
  login(email: string, password: string, fingerprint: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(authApi+'/sign-in', { email, password, fingerprint }, { withCredentials: true });
  }

  refresh(fingerprint: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(authApi+'/refresh-tokens', { fingerprint }, { withCredentials: true });
  }

  logout(): Observable<any> {
    return this.http.post<any>(authApi+'/sign-out', {}, { withCredentials: true });
  }
}
