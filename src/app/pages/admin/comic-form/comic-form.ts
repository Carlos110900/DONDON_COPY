import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Toast } from '../../../shared/services/toast/toast';

@Component({
  selector: 'app-comic-form',
  imports: [FormsModule, RouterLink],
  templateUrl: './comic-form.html',
  styleUrl: './comic-form.scss',
})
export class ComicForm {
  private readonly router = inject(Router);
  private readonly toast = inject(Toast);

  readonly tags = ['Acción', 'Aventura', 'Comedia', 'Crimen', 'Superhéroes'];
  model = { title: '', author: '', synopsis: '', status: 'ongoing' };

  submit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      this.toast.show('Revisa los campos marcados.', 'error');
      return;
    }
    // No se envía nada a ninguna API.
    this.toast.show('Cómic creado correctamente (demo).');
    this.router.navigate(['/panel/comics']);
  }
}
