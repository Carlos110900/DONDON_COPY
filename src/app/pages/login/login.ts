import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormField } from '../../shared/components/form-field/form-field';
import { Role, Session } from '../../shared/services/session';
import { Toast } from '../../shared/services/toast/toast';

// Solo demo: se quita cuando exista autenticación real
const DEMO_ROLES: { value: Role; label: string }[] = [
  { value: 'reader', label: 'Lector registrado' },
  { value: 'publisher', label: 'Publicador' },
  { value: 'admin', label: 'Administrador' },
];

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, FormField],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly session = inject(Session);
  private readonly router = inject(Router);
  private readonly toast = inject(Toast);
  protected readonly demoRoles = DEMO_ROLES;
  protected readonly submitting = signal(false);

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['reader' as Role], // solo demo
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Revisa los campos marcados.', 'error');
      return;
    }
    this.enter(this.form.controls.email.value.split('@')[0]);
  }

  // Solo demo
  loginWithGoogle(): void {
    this.enter('Usuario Google');
  }

  private enter(name: string): void {
    this.submitting.set(true);
    const { role } = this.form.getRawValue();
    this.session.login(role, name);
    this.toast.show('¡Bienvenido de nuevo!');
    this.router
      .navigate([role === 'reader' ? '/catalogo' : '/panel'])
      .finally(() => this.submitting.set(false));
  }
}
