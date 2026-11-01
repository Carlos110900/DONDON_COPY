import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { pendingChangesGuard } from './pending-changes-guard';

describe('pendingChangesGuard', () => {
  it('permite salir si no hay cambios pendientes', () => {
    const result = TestBed.runInInjectionContext(() =>
      pendingChangesGuard(
        { hasPendingChanges: () => false },
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
        {} as RouterStateSnapshot,
      ),
    );
    expect(result).toBe(true);
  });
});
