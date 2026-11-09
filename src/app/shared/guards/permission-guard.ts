import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role, Session } from '../services/session';

// Uso en rutas un mitherware
export const permissionGuard: CanActivateFn = (route, state) => {
  const session = inject(Session);
  const router = inject(Router);
  const allowed = (route.data['roles'] as Role[] | undefined) ?? [];

  if (!session.isLoggedIn())
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });

  if (allowed.length > 0 && !allowed.includes(session.role()))
    return router.createUrlTree(['/acceso-denegado']);

  return true;
};
