import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiError } from '../api/api-error';
import { ComicInput } from '../api/comic.dto';
import { Comic } from '../models/comic';
import { ComicRepository } from '../repositories/comic-repository';

type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

@Injectable({ providedIn: 'root' })
export class ComicStore {
  private readonly repository = inject(ComicRepository);

  private readonly _comics = signal<readonly Comic[]>([]);
  private readonly _status = signal<LoadStatus>('idle');
  private readonly _error = signal<ApiError | null>(null);

  readonly comics = this._comics.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isLoading = computed(() => this._status() === 'idle' || this._status() === 'loading');

  /** Carga la lista una vez; usa force = true para reintentar. */
  load(force = false): void {
    if (!force && (this._status() === 'loading' || this._status() === 'loaded')) return;

    this._status.set('loading');
    this._error.set(null);
    this.repository.getAll().subscribe({
      next: (list) => {
        this._comics.set(list);
        this._status.set('loaded');
      },
      error: (error: ApiError) => {
        this._error.set(error);
        this._status.set('error');
      },
    });
  }

  async create(id: string, input: ComicInput): Promise<Comic> {
    const created = await firstValueFrom(this.repository.create(id, input));
    this._comics.update((list) => [...list, created]);
    return created;
  }

  async update(id: string, input: ComicInput): Promise<Comic> {
    const updated = await firstValueFrom(this.repository.update(id, input));
    this._comics.update((list) => list.map((c) => (c.id === id ? updated : c)));
    return updated;
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(this.repository.remove(id));
    this._comics.update((list) => list.filter((c) => c.id !== id));
  }
}
