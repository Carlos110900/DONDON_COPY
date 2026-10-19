import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Session } from '../../shared/services/session';
import { Toast } from '../../shared/services/toast/toast';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  private readonly session = inject(Session);
  private readonly router = inject(Router);
  private readonly toast = inject(Toast);

  displayName = '';
  accepted = false;

  submit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.toast.show('Revisa los campos marcados.', 'error');
      return;
    }
    this.session.login('reader', this.displayName);
    this.toast.show('Cuenta creada correctamente.');
    this.router.navigate(['/catalogo']);
  }
}
