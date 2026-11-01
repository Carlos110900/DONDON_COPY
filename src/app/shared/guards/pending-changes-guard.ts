import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { Confirm } from '../services/confirm/confirm';

export interface HasPendingChanges {
  hasPendingChanges(): boolean;
}

export const pendingChangesGuard: CanDeactivateFn<HasPendingChanges> = (component) => {
  if (!component.hasPendingChanges()) return true;

  return inject(Confirm).ask('Tienes cambios sin guardar. ¿Deseas salir de todas formas?');
};
