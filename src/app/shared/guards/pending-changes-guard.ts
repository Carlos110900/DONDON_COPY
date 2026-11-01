import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { Confirm } from '../services/confirm/confirm';

export interface PendingChanges {
  hasPendingChanges(): boolean;
}

export const pendingChangesGuard: CanDeactivateFn<PendingChanges> = (component) => {
  if (!component.hasPendingChanges()) return true;
  return inject(Confirm).ask('Tienes cambios sin guardar. ¿Deseas salir sin guardarlos?');
};
