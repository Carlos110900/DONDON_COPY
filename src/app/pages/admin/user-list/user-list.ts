import { Component, inject } from '@angular/core';
import { Confirm } from '../../../shared/services/confirm/confirm';
import { Toast } from '../../../shared/services/toast/toast';

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: 'Lector' | 'Publicador' | 'Administrador';
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {
  private readonly confirm = inject(Confirm);
  private readonly toast = inject(Toast);

  readonly users: UserRow[] = [
    { id: 1, name: 'Diego Orozco', email: 'diego@example.com', role: 'Administrador' },
    { id: 2, name: 'Gonzalo Celis', email: 'gonzalo@example.com', role: 'Publicador' },
    { id: 3, name: 'Ana Pérez', email: 'ana@example.com', role: 'Lector' },
    { id: 4, name: 'Luis Gómez', email: 'luis@example.com', role: 'Lector' },
  ];

  async changeRole(user: UserRow): Promise<void> {
    const action = user.role === 'Publicador' ? 'degradar a Lector' : 'promover a Publicador';
    if (await this.confirm.ask(`¿Deseas ${action} a ${user.name}?`)) {
      this.toast.show('Rol actualizado correctamente (demo).');
    }
  }

  async suspend(user: UserRow): Promise<void> {
    if (await this.confirm.ask(`¿Deseas suspender la cuenta de ${user.name}?`)) {
      this.toast.show('Confirmaste la suspensión (demo: no se aplicó).', 'info');
    }
  }
}
