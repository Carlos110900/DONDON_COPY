import { Component, computed, inject } from '@angular/core';
import { ComicCard } from '../../../shared/components/comic-card/comic-card';
import { ComicRepository } from '../../../shared/repositories/comic-repository';
import { FavoritesServices } from '../../../shared/services/favorites-services';
import { SearchServices } from '../../../shared/services/search-services';

@Component({
  selector: 'app-favorites',
  imports: [ComicCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites {
  private readonly repository = inject(ComicRepository);
  private readonly favorites = inject(FavoritesServices);
  private readonly search = inject(SearchServices);

  readonly comics = computed(() => {
    const favoriteComics = this.repository
      .getAll()
      .filter((comic) => this.favorites.isFavorite(comic.id));
    return this.search.apply(favoriteComics);
  });
}
