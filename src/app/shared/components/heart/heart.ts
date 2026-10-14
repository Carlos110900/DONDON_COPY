import { Component, computed, inject, input, output } from '@angular/core';
import { FavoritesServices } from '../../services/favorites-services';

@Component({
  selector: 'app-heart',
  templateUrl: './heart.html',
  styleUrl: './heart.scss',
})
export class Heart {
  readonly comicId = input.required<string>();
  readonly favoriteChange = output<boolean>();

  private readonly favorites = inject(FavoritesServices);
  readonly isFavorite = computed(() => this.favorites.isFavorite(this.comicId()));

  toggle(): void {
    this.favoriteChange.emit(this.favorites.toggle(this.comicId()));
  }
}
