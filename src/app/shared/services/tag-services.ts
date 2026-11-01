import { Injectable, signal } from '@angular/core';
import { Tag } from '../models/tag';

const SEED_TAGS = [
  'Acción',
  'Aventura',
  'Ciencia ficción',
  'Crimen',
  'Deportes',
  'Drama',
  'Superhéroes',
];

@Injectable({ providedIn: 'root' })
export class TagServices {
  private nextId = SEED_TAGS.length + 1;
  private readonly _tags = signal<readonly Tag[]>(
    SEED_TAGS.map((name, index) => ({ id: `tag-${index + 1}`, name })),
  );
  readonly tags = this._tags.asReadonly();

  /** Un tag nuevo no se asigna a ningún cómic. Devuelve null si está vacío o repetido. */
  add(name: string): Tag | null {
    const clean = name.trim();
    if (!clean || this.exists(clean)) {
      return null;
    }
    const tag: Tag = { id: `tag-${this.nextId++}`, name: clean };
    this._tags.update((list) => [...list, tag]);
    return tag;
  }

  rename(id: string, name: string): boolean {
    const clean = name.trim();
    if (!clean || this.exists(clean, id)) {
      return false;
    }
    this._tags.update((list) => list.map((t) => (t.id === id ? { ...t, name: clean } : t)));
    return true;
  }

  /** Aquí solo se borra de la lista; quitarlo de los cómics lo hará la API. */
  remove(id: string): void {
    this._tags.update((list) => list.filter((t) => t.id !== id));
  }

  private exists(name: string, exceptId?: string): boolean {
    const normalized = name.toLowerCase();
    return this._tags().some((t) => t.id !== exceptId && t.name.toLowerCase() === normalized);
  }
}
