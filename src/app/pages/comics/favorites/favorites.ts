import { Component, computed, inject, linkedSignal } from '@angular/core';
import { ComicCard } from '../../../shared/components/comic-card/comic-card';
import { DataState } from '../../../shared/components/data-state/data-state';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { ComicStore } from '../../../shared/services/comic-store';
import { FavoritesServices } from '../../../shared/services/favorites-services';
import { SearchServices } from '../../../shared/services/search-services';
import { paginate } from '../../../shared/utils/paginate';

@Component({
  selector: 'app-favorites',
  imports: [ComicCard, DataState, Pagination],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  protected readonly store = inject(ComicStore);
  private readonly favorites = inject(FavoritesServices);
  private readonly search = inject(SearchServices);

  protected readonly page = linkedSignal({
    source: () => `${this.search.criterion()}|${this.search.text()}`,
    computation: () => 1,
  });

  protected readonly view = computed(() => {
    const favoriteComics = this.store.comics().filter((c) => this.favorites.isFavorite(c.id));
    return paginate(this.search.apply(favoriteComics), this.page());
  });

  constructor() {
    this.store.load();
  }
}
