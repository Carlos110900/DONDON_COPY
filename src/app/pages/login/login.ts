import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Role, Session } from '../../shared/services/session';
import { Toast } from '../../shared/services/toast/toast';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly session = inject(Session);
  private readonly router = inject(Router);
  private readonly toast = inject(Toast);

  // Solo para la demo: permite probar los distintos roles sin API.
  role: Role = 'reader';

  enter(): void {
    this.session.login(this.role, 'Usuario demo');
    this.toast.show('¡Bienvenido de nuevo!');
    this.router.navigate([this.role === 'reader' ? '/catalogo' : '/panel']);
  }
}
