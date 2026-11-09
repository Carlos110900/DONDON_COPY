import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { FormField } from '../../shared/components/form-field/form-field';
import { Auth } from '../../shared/services/auth/auth';
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
  private readonly auth = inject(Auth);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(Toast);
  protected readonly submitting = signal(false);
  protected readonly submitError = signal<string | null>(null);

  readonly form = this.fb.group({
    name: ['', [Validators.required, notBlank, Validators.maxLength(60)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    confirm: ['', [Validators.required, sameAs('password')]],
    accepted: [false, [Validators.requiredTrue]],
  });

  constructor() {
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
    if (this.submitting()) return;

    this.submitting.set(true);
    this.submitError.set(null);

    const { name, email, password } = this.form.getRawValue();
    this.auth
      .register({ name: name.trim(), email, password })
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (user) => {
          this.toast.show('Cuenta creada correctamente.');
          void this.auth.goAfterAuth(user, this.route.snapshot.queryParamMap.get('returnUrl'));
        },
        error: (error: Error) => this.submitError.set(error.message),
      });
  }
}
