import { Component, computed, inject } from '@angular/core';
import { ComicCard } from '../../../shared/components/comic-card/comic-card';
import { ComicRepository } from '../../../shared/repositories/comic-repository';
import { SearchServices } from '../../../shared/services/search-services';

@Component({
  selector: 'app-home',
  imports: [ComicCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly repository = inject(ComicRepository);
  private readonly search = inject(SearchServices);

  readonly comics = computed(() => this.search.apply(this.repository.getAll()));
}
