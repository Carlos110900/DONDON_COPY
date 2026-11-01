import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiError } from '../../../shared/api/api-error';
import { DataState } from '../../../shared/components/data-state/data-state';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { Comic } from '../../../shared/models/comic';
import { ComicStore } from '../../../shared/services/comic-store';
import { Confirm } from '../../../shared/services/confirm/confirm';
import { SearchServices } from '../../../shared/services/search-services';
import { Toast } from '../../../shared/services/toast/toast';
import { paginate } from '../../../shared/utils/paginate';

@Component({
  selector: 'app-comic-list',
  imports: [DataState, Pagination, RouterLink],
  templateUrl: './comic-list.html',
  styleUrl: './comic-list.scss',
})
export class ComicList {
  protected readonly store = inject(ComicStore);
  private readonly search = inject(SearchServices);
  private readonly confirm = inject(Confirm);
  private readonly toast = inject(Toast);

  protected readonly deletingId = signal<string | null>(null);

  protected readonly page = linkedSignal({
    source: () => `${this.search.criterion()}|${this.search.text()}`,
    computation: () => 1,
  });

  protected readonly view = computed(() =>
    paginate(this.search.apply(this.store.comics()), this.page()),
  );

  constructor() {
    this.store.load();
  }

  protected async remove(comic: Comic): Promise<void> {
    const ok = await this.confirm.ask(
      `¿Deseas eliminar "${comic.title}"? Esta acción no se puede deshacer.`,
    );
    if (!ok) return;

    this.deletingId.set(comic.id);
    try {
      await this.store.remove(comic.id);
      this.toast.show(`"${comic.title}" se eliminó correctamente.`);
    } catch (error) {
      this.toast.show(
        error instanceof ApiError ? error.message : 'No se pudo eliminar el cómic.',
        'error',
      );
    } finally {
      this.deletingId.set(null);
    }
  }
}
