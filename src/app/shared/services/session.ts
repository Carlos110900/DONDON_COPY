import { Injectable, computed, signal } from '@angular/core';
export type Role = 'visitor' | 'reader' | 'publisher' | 'admin';
const TOKEN_KEY = 'dondo.token'; // esto es lo mismo a el JWT_SECRET del .env o al JWT_EXPIRES_IN

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Exclude<Role, 'visitor'>;
  photo?: string;
}

@Injectable({ providedIn: 'root' })
export class Session {
  readonly token = signal('');
  readonly expiredNotice = signal(false);
  readonly role = signal<Role>('visitor');
  readonly user = signal<SessionUser | null>(null);
  readonly userName = computed(() => this.user()?.name ?? '');
  readonly isLoggedIn = computed(() => this.role() !== 'visitor' && !!this.token());
  readonly expired = computed(() => !this.isLoggedIn());

  login(role: Role, name: string): void {
    const nextRole = role === 'visitor' ? 'reader' : role;
    this.role.set(nextRole);
    this.user.set({
      id: 'demo-user',
      name,
      email: '',
      role: nextRole,
      photo: '',
    });
    this.token.set('demo-token');
  }

  setSession(token: string, user: SessionUser): void {
    this.token.set(token);
    this.role.set(user.role);
    this.user.set(user);
    this.expiredNotice.set(false);
    this.save(token);
  }

  logout(): void {
    this.token.set('');
    this.role.set('visitor');
    this.user.set(null);
    this.save('');
  }

  readStoredToken(): string {
    return this.storage?.getItem(TOKEN_KEY) ?? '';
  }

  private get storage(): Storage | null {
    try {
      return typeof localStorage === 'undefined' ? null : localStorage;
    } catch {
      return null;
    }
  }

  private save(token: string): void {
    try {
      if (token) this.storage?.setItem(TOKEN_KEY, token);
      else this.storage?.removeItem(TOKEN_KEY);
    } catch {
      // Sin almacenamiento disponible
    }
  }
}
