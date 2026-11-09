import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, finalize } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthUserDto } from '../../shared/api/auth.dto';
import { FormField } from '../../shared/components/form-field/form-field';
import { Auth } from '../../shared/services/auth/auth';
import { GoogleIdentity } from '../../shared/services/auth/google-identity';
import { Session } from '../../shared/services/session';
import { Toast } from '../../shared/services/toast/toast';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, FormField],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(Auth);
  private readonly google = inject(GoogleIdentity);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(Toast);
  protected readonly sessionExpired = inject(Session).expiredNotice;
  protected readonly submitting = signal(false);
  protected readonly submitError = signal<string | null>(null);
  private readonly googleButton = viewChild<ElementRef<HTMLElement>>('googleButton');

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor() {
    afterNextRender(() => {
      const host = this.googleButton()?.nativeElement;
      if (!host || !environment.googleClientId) return;
      this.google
        .renderButton(host, (idToken) => this.run(this.auth.loginWithGoogle(idToken)))
        .catch(() => this.submitError.set('No se pudo cargar el inicio de sesión con Google.'));
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Revisa los campos marcados.', 'error');
      return;
    }
    this.run(this.auth.login(this.form.getRawValue()));
  }

  private run(request$: Observable<AuthUserDto>): void {
    if (this.submitting()) return;
    this.submitting.set(true);
    this.submitError.set(null);

    request$.pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: (user) => {
        this.toast.show('¡Bienvenido de nuevo!');
        void this.auth.goAfterAuth(user, this.route.snapshot.queryParamMap.get('returnUrl'));
      },
      error: (error: Error) => {
        this.submitError.set(error.message);
        this.form.controls.password.reset();
      },
    });
  }
}
