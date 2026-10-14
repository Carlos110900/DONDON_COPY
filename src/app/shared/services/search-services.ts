import { Injectable, signal } from '@angular/core';
import { Comic } from '../../shared/models/comic';

export type Criterion = 'person' | 'title' | 'publisher' | 'genre';

export interface SearchCriterion {
  readonly value: Criterion;
  readonly label: string;
  readonly extract: (comic: Comic) => readonly string[];
}

/** Para agregar un criterio nuevo solo se agrega una entrada aquí. */
export const SEARCH_CRITERIA: readonly SearchCriterion[] = [
  { value: 'title', label: 'Cómic', extract: (c) => [c.title] },
  { value: 'person', label: 'Persona', extract: (c) => c.involved.map((p) => p.name) },
  { value: 'publisher', label: 'Editorial', extract: (c) => [c.publisher] },
  { value: 'genre', label: 'Género', extract: (c) => c.genres },
];

@Injectable({ providedIn: 'root' })
export class SearchServices {
  readonly criteria = SEARCH_CRITERIA;
  readonly criterion = signal<Criterion>('title');
  readonly text = signal('');

  setCriterion(criterion: Criterion): void {
    this.criterion.set(criterion);
  }

  setText(text: string): void {
    this.text.set(text);
  }

  clear(): void {
    this.text.set('');
  }

  apply(comics: readonly Comic[]): Comic[] {
    const query = this.normalize(this.text());
    if (!query) {
      return [...comics];
    }

    const active = this.criteria.find((c) => c.value === this.criterion());
    if (!active) {
      return [...comics];
    }

    return comics.filter((comic) =>
      active.extract(comic).some((value) => this.normalize(value).includes(query)),
    );
  }

  private normalize(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }
}
