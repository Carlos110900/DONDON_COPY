import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal } from '@angular/core';
import { ComicCard } from '../../../shared/components/comic-card/comic-card';
import { DataState } from '../../../shared/components/data-state/data-state';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { ComicStore } from '../../../shared/services/comic-store';
import { SearchServices } from '../../../shared/services/search-services';
import { paginate } from '../../../shared/utils/paginate';

@Component({
  selector: 'app-home',
  imports: [ComicCard, DataState, Pagination],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly store = inject(ComicStore);
  private readonly search = inject(SearchServices);

  // Vuelve a la página 1 cada vez que cambia el texto o el criterio de búsqueda
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
}
