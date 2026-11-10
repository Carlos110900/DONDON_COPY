import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Session } from '../services/session';

// evitar que una persona logueada vuelva a login
export const guestGuard: CanActivateFn = () => {
  const session = inject(Session);
  if (!session.isLoggedIn()) return true;
  return inject(Router).createUrlTree([session.role() === 'reader' ? '/catalogo' : '/panel']);
};
