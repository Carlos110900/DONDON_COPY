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
      '/comics/absolute-batman/cover/absolute-batman.jpg',
      'DC Comics',
      ['Superhéroes', 'Acción', 'Crimen'],
      [new Involved('Scott Snyder', 'writer'), new Involved('Nick Dragotta', 'artist')],
      [
        new Chapter(
          1,
          'Absolute Batman #1',
          '/comics/absolute-batman/chapters/Absolute_Batman_1.pdf',
        ),
        new Chapter(
          2,
          'Absolute Batman #2',
          '/comics/absolute-batman/chapters/Absolute_Batman_2.pdf',
        ),
        new Chapter(
          3,
          'Absolute Batman #3',
          '/comics/absolute-batman/chapters/Absolute_Batman_3.pdf',
        ),
        new Chapter(
          4,
          'Absolute Batman #4',
          '/comics/absolute-batman/chapters/Absolute_Batman_4.pdf',
        ),
      ],
    ),
    new Comic(
      'initial-d',
      'Initial D',
      'Takumi Fujiwara es un joven repartidor de tofu que se ve envuelto en el mundo de las carreras callejeras en las montañas de Gunma, Japón.',
      '/comics/initial-d/cover/initial-d.jpg',
      'Kodansha',
      ['Deportes', 'Acción', 'Drama'],
      [new Involved('Shuichi Shigeno', 'writer'), new Involved('Shuichi Shigeno', 'artist')],
      [
        new Chapter(1, 'Initial D #1', '/comics/initial-d/chapters/Initial_D_1.pdf'),
        new Chapter(2, 'Initial D #2', '/comics/initial-d/chapters/Initial_D_2.pdf'),
        new Chapter(3, 'Initial D #3', '/comics/initial-d/chapters/Initial_D_3.pdf'),
        new Chapter(4, 'Initial D #4', '/comics/initial-d/chapters/Initial_D_4.pdf'),
        new Chapter(5, 'Initial D #5', '/comics/initial-d/chapters/Initial_D_5.pdf'),
        new Chapter(6, 'Initial D #6', '/comics/initial-d/chapters/Initial_D_6.pdf'),
        new Chapter(7, 'Initial D #7', '/comics/initial-d/chapters/Initial_D_7.pdf'),
        new Chapter(8, 'Initial D #8', '/comics/initial-d/chapters/Initial_D_8.pdf'),
        new Chapter(9, 'Initial D #9', '/comics/initial-d/chapters/Initial_D_9.pdf'),
        new Chapter(10, 'Initial D #10', '/comics/initial-d/chapters/Initial_D_10.pdf'),
        new Chapter(11, 'Initial D #11', '/comics/initial-d/chapters/Initial_D_11.pdf'),
        new Chapter(12, 'Initial D #12', '/comics/initial-d/chapters/Initial_D_12.pdf'),
        new Chapter(13, 'Initial D #13', '/comics/initial-d/chapters/Initial_D_13.pdf'),
        new Chapter(14, 'Initial D #14', '/comics/initial-d/chapters/Initial_D_14.pdf'),
        new Chapter(15, 'Initial D #15', '/comics/initial-d/chapters/Initial_D_15.pdf'),
        new Chapter(16, 'Initial D #16', '/comics/initial-d/chapters/Initial_D_16.pdf'),
        new Chapter(17, 'Initial D #17', '/comics/initial-d/chapters/Initial_D_17.pdf'),
        new Chapter(18, 'Initial D #18', '/comics/initial-d/chapters/Initial_D_18.pdf'),
      ],
    ),
    new Comic(
      'ben-10-dynamite',
      'Ben 10: Dynamite',
      'Ben Tennyson, un joven de 10 años, descubre un dispositivo alienígena llamado Omnitrix que le permite transformarse en diferentes especies alienígenas y luchar contra el mal.',
      '/comics/ben-10-dynamite/cover/ben-10-dynamite.jpg',
      'Cartoon Network',
      ['Aventura', 'Ciencia ficción', 'Acción'],
      [new Involved('Dwayne McDuffie', 'writer'), new Involved('Manuel Gutierrez', 'artist')],
      [
        new Chapter(
          1,
          'Ben 10: Dynamite #1',
          '/comics/ben-10-dynamite/chapters/Ben_10_Dynamite_1.pdf',
        ),
        new Chapter(
          2,
          'Ben 10: Dynamite #2',
          '/comics/ben-10-dynamite/chapters/Ben_10_Dynamite_2.pdf',
        ),
        new Chapter(
          3,
          'Ben 10: Dynamite #3',
          '/comics/ben-10-dynamite/chapters/Ben_10_Dynamite_3.pdf',
        ),
        new Chapter(
          4,
          'Ben 10: Dynamite #4',
          '/comics/ben-10-dynamite/chapters/Ben_10_Dynamite_4.pdf',
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
