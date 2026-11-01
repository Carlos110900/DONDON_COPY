import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Confirm } from '../services/confirm/confirm';
import { pendingChangesGuard } from './pending-changes-guard';

describe('pendingChangesGuard', () => {
  const run = (pending: boolean) =>
    TestBed.runInInjectionContext(() =>
      pendingChangesGuard(
        { hasPendingChanges: () => pending },
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot,
        {} as RouterStateSnapshot,
      ),
    );

  it('permite salir si no hay cambios', () => {
    expect(run(false)).toBe(true);
  });

  it('pide confirmación si hay cambios', async () => {
    const confirm = TestBed.inject(Confirm);
    const result = run(true) as Promise<boolean>;

    expect(confirm.message()).toContain('cambios sin guardar');
    confirm.answer(false);
    expect(await result).toBe(false);
  });
});
