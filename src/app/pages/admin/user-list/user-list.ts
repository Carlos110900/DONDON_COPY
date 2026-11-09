import { ChangeDetectionStrategy, Component, inject, linkedSignal, signal } from '@angular/core';
import { of } from 'rxjs';

import { ApiError } from '../../../shared/api/api-error';
import { AuthRole } from '../../../shared/api/auth.dto';
import { DataState } from '../../../shared/components/data-state/data-state';
import { AdminUser, UserAdminRepository } from '../../../shared/repositories/user-admin-repository';
import { Confirm } from '../../../shared/services/confirm/confirm';
import { Toast } from '../../../shared/services/toast/toast';
import { loadResource } from '../../../shared/utils/load-resource';

const ROLE_LABELS: Record<AuthRole, string> = {
  reader: 'Lector',
  publisher: 'Publicador',
  admin: 'Administrador',
};

@Component({
  selector: 'app-user-list',
  imports: [DataState],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {
  private readonly repository = inject(UserAdminRepository);
  private readonly confirm = inject(Confirm);
  private readonly toast = inject(Toast);

  private readonly resource = loadResource(of('users'), () => this.repository.getAll());
  protected readonly loading = this.resource.loading;
  protected readonly error = this.resource.error;
  protected readonly users = linkedSignal<AdminUser[]>(() => this.resource.data() ?? []);
  protected readonly busyId = signal<string | null>(null);

  protected roleLabel(role: AuthRole): string {
    return ROLE_LABELS[role];
  }

  protected reload(): void {
    this.resource.reload();
  }

  protected async changeRole(user: AdminUser): Promise<void> {
    const next: AuthRole = user.role === 'publisher' ? 'reader' : 'publisher';
    const action = next === 'reader' ? 'degradar a Lector' : 'promover a Publicador';
    if (!(await this.confirm.ask(`¿Deseas ${action} a ${user.name}?`))) return;

    await this.apply(
      user,
      () => this.repository.setRole(user.id, next),
      'Rol actualizado correctamente.',
    );
  }

  protected async toggleSuspension(user: AdminUser): Promise<void> {
    const suspending = user.status === 'active';
    const question = suspending
      ? `¿Deseas suspender la cuenta de ${user.name}?`
      : `¿Deseas reactivar la cuenta de ${user.name}?`;
    if (!(await this.confirm.ask(question))) return;

    await this.apply(
      user,
      () => this.repository.setStatus(user.id, suspending ? 'banned' : 'active'),
      suspending ? 'Cuenta suspendida.' : 'Cuenta reactivada.',
    );
  }

  private async apply(
    user: AdminUser,
    request: () => ReturnType<UserAdminRepository['setRole']>,
    successMessage: string,
  ): Promise<void> {
    this.busyId.set(user.id);
    try {
      const updated = await new Promise<AdminUser>((resolve, reject) =>
        request().subscribe({ next: resolve, error: reject }),
      );
      this.users.update((list) => list.map((u) => (u.id === updated.id ? updated : u)));
      this.toast.show(successMessage);
    } catch (error) {
      this.toast.show(
        error instanceof ApiError ? error.message : 'No se pudo completar la acción.',
        'error',
      );
    } finally {
      this.busyId.set(null);
    }
  }
}
