import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { startWith, switchMap } from 'rxjs';

type MessageFn = (detail: ValidationErrors) => string;

const MENSAJES_DEFAULT: Record<string, MessageFn> = {
  required: () => 'Este campo es obligatorio.',
  blank: () => 'No puede quedar en blanco.',
  email: () => 'Escribe un correo válido.',
  minlength: (d) => `Escribe al menos ${d['requiredLength']} caracteres.`,
  mismatch: () => 'Las contraseñas no coinciden.',
  minSelected: (d) => `Selecciona al menos ${d['required']}.`,
  coverType: () => 'El archivo debe ser una imagen.',
  coverSize: () => 'La imagen no debe pesar más de 5 MB.',
};

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormField {
  readonly control = input.required<AbstractControl>();
  readonly label = input('');
  readonly inputId = input('');
  readonly messages = input<Record<string, string>>({});

  private readonly changes = toSignal(
    toObservable(this.control).pipe(switchMap((control) => control.events.pipe(startWith(null)))),
    { initialValue: null },
  );

  protected readonly error = computed(() => {
    this.changes(); // Revisa cuando el control cambia
    const control = this.control();
    const errors = control.errors;
    if (!errors || !(control.touched || control.dirty)) return null;

    const [key, detail] = Object.entries(errors)[0];
    return (
      this.messages()[key] ??
      MENSAJES_DEFAULT[key]?.((detail ?? {}) as ValidationErrors) ??
      'El valor no es válido.'
    );
  });
}
