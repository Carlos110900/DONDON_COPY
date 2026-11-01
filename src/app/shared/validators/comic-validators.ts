import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { catchError, map, of, switchMap, timer } from 'rxjs';
import { ComicRepository } from '../repositories/comic-repository';
import { slugify } from '../utils/slugify';

/** Texto "Ana, Luis" -> ['Ana', 'Luis'] */
export function parseNames(text: string): string[] {
  return text
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
}

/** Rechaza texto compuesto solo por espacios (required lo deja pasar). */
export const noBlank: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value;
  return typeof value === 'string' && value.length > 0 && value.trim().length === 0
    ? { blank: true }
    : null;
};

/** Ruta dentro de /public: empieza con "/", sin "..", y con una extensión permitida. */
export function publicAsset(extensions: readonly string[]): ValidatorFn {
  const pattern = new RegExp(`^/[\\w\\-./]+\\.(${extensions.join('|')})$`, 'i');
  return (control) => {
    const value = String(control.value ?? '').trim();
    if (!value) return null; // required se encarga de vacío
    return pattern.test(value) && !value.includes('..') ? null : { assetPath: { extensions } };
  };
}

export function minSelected(min: number): ValidatorFn {
  return (control) =>
    Array.isArray(control.value) && control.value.length >= min ? null : { minSelected: { min } };
}

/** Lista separada por comas: cada nombre con al menos 2 caracteres. */
export const namesList: ValidatorFn = (control) => {
  const names = parseNames(String(control.value ?? ''));
  if (names.length === 0) return null;
  return names.every((name) => name.length >= 2) ? null : { names: true };
};

/** Asíncrono: el id (slug del título) no debe existir ya en la API. */
export function uniqueComicId(repository: ComicRepository): AsyncValidatorFn {
  return (control) => {
    const id = slugify(String(control.value ?? ''));
    if (!id) return of(null);
    return timer(400).pipe(
      // Angular cancela la validación anterior si el valor cambia: esto hace de debounce
      switchMap(() => repository.exists(id)),
      map((exists) => (exists ? { idTaken: true } : null)),
      catchError(() => of(null)), // si la API falla, el POST devolverá el error real
    );
  };
}
