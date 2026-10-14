import { Injectable } from '@angular/core';
import { Chapter } from '../models/chapter';
import { Comic } from '../models/comic';
import { Involved } from '../models/involved/involved';
import { ComicRepository } from './comic-repository';

@Injectable({ providedIn: 'root' })
export class LocalComicRepository extends ComicRepository {
  private readonly comics: readonly Comic[] = [
    new Comic(
      'absolute-batman',
      'Absolute Batman',
      'Una versión distinta de Gotham y de Bruce Wayne, sin fortuna ni mayordomo, con una fuerza fuera de lo común.',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnaWSw8oigfsIfpUi3wGY4d0b6Eu7wbwjgsTMOqZpuxg&s=10',
      'DC Comics',
      ['Superhéroes', 'Acción', 'Crimen'],
      [new Involved('Scott Snyder', 'writer'), new Involved('Nick Dragotta', 'artist')],
      [
        new Chapter(
          1,
          'Absolute Batman #1',
          '/comics/absolute-batman/chapters/Absolute_Batman_1.pdf',
        ),
      ],
    ),
  ];

  getAll(): readonly Comic[] {
    return this.comics;
  }

  getById(id: string): Comic | undefined {
    return this.comics.find((comic) => comic.id === id);
  }
}
