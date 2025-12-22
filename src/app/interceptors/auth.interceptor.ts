import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../core/services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const token = authService.getAccessToken();

  let modifiedReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

    return next(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log('refreshing..........');
          
          return authService.refreshAccessToken().pipe(
            switchMap(newToken => {
              modifiedReq = req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } });
              console.log(newToken);
              return next(modifiedReq);
            }),
            catchError(refreshError => {
              authService.logout();
              router.navigate(['/auth/login']);
              return throwError(() => refreshError);
            })
          );
        } else if (error.status === 403) {
          router.navigate(['/auth/unauthorized']);
        }
        return throwError(() => error);
      })
    );
  };