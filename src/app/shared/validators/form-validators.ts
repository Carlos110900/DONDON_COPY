import { ValidationErrors, ValidatorFn } from '@angular/forms';

export const TAMAÑO_MAXIMO = 10 * 1024 * 1024;

// no se pueden solo espasios
export const notBlank: ValidatorFn = (control): ValidationErrors | null => {
  const value = control.value as unknown;
  return typeof value === 'string' && value.length > 0 && value.trim() === ''
    ? { blank: true }
    : null;
};

// confirmar contrarseña (las 2 iguales)
export function sameAs(otherName: string): ValidatorFn {
  return (control): ValidationErrors | null => {
    const other = control.parent?.get(otherName);
    if (!other) return null;
    return control.value === other.value ? null : { mismatch: true };
  };
}

// minimo un tag
export function minSelected(min: number): ValidatorFn {
  return (control): ValidationErrors | null => {
    const value = control.value as unknown;
    const count = Array.isArray(value) ? value.length : 0;
    return count >= min ? null : { minSelected: { required: min } };
  };
}

// tamaño maximo de la portada 5 MB y si no poner la portada-default.png
export const coverFile: ValidatorFn = (control): ValidationErrors | null => {
  const file = control.value as File | null;
  if (!file) return null;

  if (!file.type.startsWith('image/')) return { coverType: true };

  return file.size > TAMAÑO_MAXIMO ? { coverSize: true } : null;
};
