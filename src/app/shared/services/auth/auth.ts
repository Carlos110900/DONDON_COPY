import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, map } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthLoginResponse, AuthUserDto } from '../../api/auth.dto';
import { Session, SessionUser } from '../session';
import { ApiError } from '../../api/api-error';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly session = inject(Session);
  private readonly router = inject(Router);

  private readonly baseUrl = `${environment.authUrl}/auth`;

  login(payload: { email: string; password: string }): Observable<AuthUserDto> {
    return this.http
      .post<AuthLoginResponse>(`${this.baseUrl}/login`, payload)
      .pipe(map((response) => this.applySession(response)));
  }

  loginWithGoogle(idToken: string): Observable<AuthUserDto> {
    return this.http
      .post<AuthLoginResponse>(`${this.baseUrl}/google`, { idToken })
      .pipe(map((response) => this.applySession(response)));
  }

  register(payload: { name: string; email: string; password: string }): Observable<AuthUserDto> {
    return this.http
      .post<AuthLoginResponse>(`${this.baseUrl}/register`, payload)
      .pipe(map((response) => this.applySession(response)));
  }

  // cerrar sesión en el backend y limpiar la sesión local
  async logout(): Promise<boolean> {
    try {
      if (this.session.isLoggedIn())
        await firstValueFrom(this.http.post(`${this.baseUrl}/logout`, {}));
    } catch {
      // Si falla se cierra la sesión local.
    }
    this.session.logout();
    return this.router.navigate(['/']);
  }

  goAfterAuth(user: AuthUserDto, returnUrl: string | null): Promise<boolean> {
    this.session.setSession(this.session.token() || 'local-session', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      photo: user.photo,
    } satisfies SessionUser);

    const target = returnUrl || (user.role === 'reader' ? '/catalogo' : '/panel');
    return this.router.navigateByUrl(target);
  }

  private applySession(response: AuthLoginResponse): AuthUserDto {
    this.session.setSession(response.token, {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      role: response.user.role,
      photo: response.user.photo,
    });
    return response.user;
  }

  // Si hay token reutikisarki
  async restoreSession(): Promise<void> {
    const token = this.session.readStoredToken();
    if (!token) return;

    this.session.token.set(token); // para que authInterceptor lo envíe
    try {
      const { user } = await firstValueFrom(
        this.http.get<{ success: boolean; user: AuthUserDto }>(`${this.baseUrl}/me`),
      );
      this.session.setSession(token, {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
      });
    } catch (error) {
      this.session.logout();
      this.session.expiredNotice.set(error instanceof ApiError && error.status === 401);
    }
  }
}
