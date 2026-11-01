import { computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  BehaviorSubject,
  Observable,
  catchError,
  combineLatest,
  map,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { ApiError } from '../api/api-error';

export type Loadable<T> =
  | { readonly status: 'loading' }
  | { readonly status: 'error'; readonly error: ApiError }
  | { readonly status: 'success'; readonly data: T };

const LOADING: Loadable<never> = { status: 'loading' };

function toLoadable<T>(source$: Observable<T>): Observable<Loadable<T>> {
  return source$.pipe(
    map((data): Loadable<T> => ({ status: 'success', data })),
    startWith<Loadable<T>>(LOADING),
    catchError((error: unknown) =>
      of<Loadable<T>>({
        status: 'error',
        error: error instanceof ApiError ? error : new ApiError('Ocurrió un error inesperado.', -1),
      }),
    ),
  );
}

/** Carga un recurso según una clave (ej. el :id de la ruta), con loading, error y reintento. */
export function loadResource<T>(key$: Observable<string>, fetcher: (key: string) => Observable<T>) {
  const refresh$ = new BehaviorSubject<void>(undefined);
  const state = toSignal(
    combineLatest([key$, refresh$]).pipe(switchMap(([key]) => toLoadable(fetcher(key)))),
    { initialValue: LOADING as Loadable<T> },
  );

  return {
    loading: computed(() => state().status === 'loading'),
    data: computed(() => {
      const s = state();
      return s.status === 'success' ? s.data : null;
    }),
    error: computed(() => {
      const s = state();
      return s.status === 'error' ? s.error : null;
    }),
    reload: () => refresh$.next(),
  };
}
