import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay, switchMap, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { authApi } from './auth.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {
  private readonly authService = inject(AuthService);

  private refreshObservable: Observable<any> | null = null;

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   
    if (!this.authService.isLoggedIn || req.url.includes(authApi)) {
      return next.handle(req);
    }

    if (this.authService.isExpired) {
      if (this.refreshObservable == null) {
        this.refreshObservable = this.authService.refresh().pipe(
          tap(() => this.refreshObservable = null),
          shareReplay(1),
        );
      }

      return this.refreshObservable.pipe(
        switchMap(() => this.injectAccessTokenAndHandle(req, next)),
      )
    }

    return this.injectAccessTokenAndHandle(req, next);
  }

  private injectAccessTokenAndHandle(req: HttpRequest<any>, next:HttpHandler): Observable<HttpEvent<any>> {
    const newReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + this.authService.accessToken!)
    });

    return next.handle(newReq);
  }
}