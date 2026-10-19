import { Injectable, computed, signal } from '@angular/core';

export type Role = 'visitor' | 'reader' | 'publisher' | 'admin';

/** Sesión SIMULADA: no hay API, solo guarda el rol en memoria. */
@Injectable({ providedIn: 'root' })
export class Session {
  readonly role = signal<Role>('visitor');
  readonly userName = signal('');
  readonly isLoggedIn = computed(() => this.role() !== 'visitor');

  login(role: Role, name: string): void {
    this.role.set(role);
    this.userName.set(name);
  }

  logout(): void {
    this.role.set('visitor');
    this.userName.set('');
  }
}
