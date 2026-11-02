import { AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { catchError, map, of, switchMap, timer } from 'rxjs';
import { ComicRepository } from '../repositories/comic-repository';
import { slugify } from '../utils/slugify';

export const TAMAÑO_MAXIMO = 5 * 1024 * 1024;

// no se pueden solo espacios
export const notBlank: ValidatorFn = (control): ValidationErrors | null => {
  const value = control.value as unknown;
  return typeof value === 'string' && value.length > 0 && value.trim() === ''
    ? { blank: true }
    : null;
};

// confirmar contraseña (las 2 iguales)
export function sameAs(otherName: string): ValidatorFn {
  return (control): ValidationErrors | null => {
    const other = control.parent?.get(otherName);
    if (!other) return null;
    return control.value === other.value ? null : { mismatch: true };
  };
}

// minimo un tag
// mínimo un elemento seleccionado
export function minSelected(min: number): ValidatorFn {
  return (control): ValidationErrors | null => {
    const value = control.value as unknown;
    const count = Array.isArray(value) ? value.length : 0;
    return count >= min ? null : { minSelected: { required: min } };
  };
}

// tamaño maximo de la portada 5 MB y si no poner la portada-default.png
// portada: debe ser imagen y pesar máximo 5 MB
export const coverFile: ValidatorFn = (control): ValidationErrors | null => {
  const file = control.value as File | null;
  if (!file) return null;

  if (!file.type.startsWith('image/')) return { coverType: true };

  return file.size > TAMAÑO_MAXIMO ? { coverSize: true } : null;
};

/** "Ana, Luis" -> ['Ana', 'Luis'] */
export function parseNames(text: string): string[] {
  return text
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
}

/** Lista separada por comas: debe haber al menos un nombre y cada uno de 2+ caracteres. */
export const namesList: ValidatorFn = (control): ValidationErrors | null => {
  const text = String(control.value ?? '');
  if (!text.trim()) return null; // required / notBlank se encargan
  const names = parseNames(text);
  return names.length > 0 && names.every((name) => name.length >= 2) ? null : { names: true };
};

/** Asíncrono: el id (slug del título) no debe existir ya en la API. */
export function uniqueComicId(repository: ComicRepository): AsyncValidatorFn {
  return (control) => {
    const id = slugify(String(control.value ?? ''));
    if (!id) return of(null);
    return timer(400).pipe(
      switchMap(() => repository.exists(id)),
      map((exists) => (exists ? { idTaken: true } : null)),
      catchError(() => of(null)),
    );
  };
}
