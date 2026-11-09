import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthRole } from '../api/auth.dto';

export type AccountStatus = 'active' | 'banned';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  status: AccountStatus;
  creationDate: string;
}

interface Envelope<T> {
  success: boolean;
  data: T;
}

/** Gestión de usuarios (solo admin; la API devuelve 403 a cualquier otro rol). */
@Injectable({ providedIn: 'root' })
export class UserAdminRepository {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.authUrl}/users`;

  getAll(): Observable<AdminUser[]> {
    return this.http.get<Envelope<AdminUser[]>>(this.url).pipe(map((res) => res.data));
  }

  setRole(id: string, role: AuthRole): Observable<AdminUser> {
    return this.http
      .patch<Envelope<AdminUser>>(`${this.itemUrl(id)}/role`, { role })
      .pipe(map((res) => res.data));
  }

  setStatus(id: string, status: AccountStatus): Observable<AdminUser> {
    return this.http
      .patch<Envelope<AdminUser>>(`${this.itemUrl(id)}/status`, { status })
      .pipe(map((res) => res.data));
  }

  remove(id: string): Observable<unknown> {
    return this.http.delete(this.itemUrl(id));
  }

  private itemUrl(id: string): string {
    return `${this.url}/${encodeURIComponent(id)}`;
  }
}
