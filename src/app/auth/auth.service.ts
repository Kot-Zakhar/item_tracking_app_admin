import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, switchMap, tap, throwError } from 'rxjs';
import { LoginService } from './login.service';
import { LocalStorageService } from '@shared/services/storage.service';
import { v4 as uuidv4 } from 'uuid';
import { Router } from '@angular/router';

const accessTokenStorageKey = 'trck-accessToken';
const fingerprintStorageKey = 'trck-fingerprint';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly loginService = inject(LoginService);
  private readonly storageService = inject(LocalStorageService);
  private readonly router = inject(Router);

  private _accessToken: string | null = null;
  private _expiresAt: number | null = null;
  private _fingerprint: string | null = null;

  get isLoggedIn() {
    return this._accessToken !== null;
  }

  get isExpired() {
    return this._expiresAt !== null && Date.now() >= (this._expiresAt - 1000);
  }

  get accessToken(): string | null {
    return this._accessToken;
  }

  constructor() {
    this.restoreState();
  }

  login(email: string, password: string): Observable<boolean> {
    return this.loginService.login(email, password, this._fingerprint!).pipe(
      tap(({ accessToken }) => this.setTokens(accessToken)),
      map(() => true)
    );
  }

  logout(): Observable<void> {
    this.silentLogout();
    return this.loginService.logout(this._fingerprint!);
  }

  refresh(): Observable<any> {
    return this.loginService.refresh(this._fingerprint!).pipe(
      catchError(error => {
        this.silentLogout();
        return throwError(() => error);
      }),
      tap(({ accessToken }) => this.setTokens(accessToken)),
    );
  }

  private restoreState() {
    this._accessToken = this.storageService.get<string>(accessTokenStorageKey);
    this._fingerprint = this.storageService.get<string>(fingerprintStorageKey); 
    if (!this._fingerprint) {
      this._fingerprint = uuidv4();
      this.storageService.set(fingerprintStorageKey, this._fingerprint);
    }

    this.processAccessToken();
  }

  private setTokens(accessToken: string) {
    this._accessToken = accessToken;
    this.storageService.set(accessTokenStorageKey, accessToken);
   
    this.processAccessToken();
  }

  private removeTokens() {
    this._accessToken = null;
    this.storageService.remove(accessTokenStorageKey);
  }

  private processAccessToken() {
    if (!this._accessToken) {
      return;
    }

    const tokenData = JSON.parse(atob(this._accessToken.split('.')[1]));
    this._expiresAt = tokenData.exp * 1000;
  }

  private silentLogout() {
    this.removeTokens();
    this.router.navigate(['/']);
  }
}