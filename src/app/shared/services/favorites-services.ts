import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritesServices {
  private readonly _ids = signal<readonly string[]>([]);
  readonly ids = this._ids.asReadonly();

  isFavorite(id: string): boolean {
    return this._ids().includes(id);
  }

  add(id: string): void {
    if (!this.isFavorite(id)) {
      this._ids.update((current) => [...current, id]);
    }
  }

  remove(id: string): void {
    this._ids.update((current) => current.filter((item) => item !== id));
  }

  /** Devuelve el nuevo estado: true si quedó como favorito. */
  toggle(id: string): boolean {
    if (this.isFavorite(id)) {
      this.remove(id);
      return false;
    }
    this.add(id);
    return true;
  }
}
