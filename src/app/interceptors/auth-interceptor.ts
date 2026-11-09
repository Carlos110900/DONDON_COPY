import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Session } from '../shared/services/session';

// Solo peticiones a nuestra api y auth api llevan el token
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(Session).token();
  const isOurApi = [environment.apiUrl, environment.authUrl].some((base) =>
    req.url.startsWith(base),
  );
  if (!token || !isOurApi) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
