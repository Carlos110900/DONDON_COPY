import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FormField } from '../../shared/components/form-field/form-field';
import { Session } from '../../shared/services/session';
import { Toast } from '../../shared/services/toast/toast';
import { notBlank, sameAs } from '../../shared/validators/form-validators';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, FormField],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly session = inject(Session);
  private readonly router = inject(Router);
  private readonly toast = inject(Toast);

  protected readonly submitting = signal(false);

  readonly form = this.fb.group({
    name: ['', [Validators.required, notBlank]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm: ['', [Validators.required, sameAs('password')]],
    accepted: [false, [Validators.requiredTrue]],
  });

  constructor() {
    // Si cambia la contraseña, vuelve a validar la confirmación
    this.form.controls.password.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.form.controls.confirm.updateValueAndValidity());
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Revisa los campos marcados.', 'error');
      return;
    }
    this.submitting.set(true);
    // Pendiente: enviar a la API (/users) cuando haya autenticación real
    this.session.login('reader', this.form.controls.name.value);
    this.toast.show('Cuenta creada correctamente.');
    this.router.navigate(['/catalogo']).finally(() => this.submitting.set(false));
  }
}
