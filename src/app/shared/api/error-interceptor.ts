import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Session } from '../services/session';
import { toApiError } from './api-error';

// Manejan 401 y 403 (credenciales incorrectas y token vencido)
const HANDLED_BY_CALLER = /\/auth\/(login|register|google|me|logout)$/;

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const session = inject(Session);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) return throwError(() => error);

      if (error.status === 401 && !HANDLED_BY_CALLER.test(req.url)) {
        const hadSession = session.isLoggedIn();
        session.logout();
        session.expiredNotice.set(hadSession);
        if (!router.url.startsWith('/login'))
          void router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
      }
      return throwError(() => toApiError(error));
    }),
  );
};
