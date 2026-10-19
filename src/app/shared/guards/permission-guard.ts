import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Role, Session } from '../services/session';
import { Toast } from '../services/toast/toast';

/** Uso en rutas: canActivate: [permissionGuard], data: { roles: ['admin'] } */
export const permissionGuard: CanActivateFn = (route) => {
  const session = inject(Session);
  const router = inject(Router);
  const toast = inject(Toast);
  const allowed = (route.data['roles'] as Role[] | undefined) ?? [];

  if (!session.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }
  if (allowed.length > 0 && !allowed.includes(session.role())) {
    toast.show('No tienes permiso para entrar a esa sección.', 'error');
    return router.createUrlTree(['/catalogo']);
  }
  return true;
};
