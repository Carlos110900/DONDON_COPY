import { Chapter } from './chapter';
import { Comic } from './comic';
import { Involved } from './involved/involved';

describe('Comic', () => {
  const comic = new Comic(
    'id',
    'Título',
    'Descripción',
    '/cover.jpg',
    'Editorial',
    ['Acción'],
    [new Involved('Ana', 'writer'), new Involved('Luis', 'artist')],
    [new Chapter(1, 'Cap 1', '/1.pdf')],
  );

  it('separa escritores y dibujantes', () => {
    expect(comic.writers.map((p) => p.name)).toEqual(['Ana']);
    expect(comic.artists.map((p) => p.name)).toEqual(['Luis']);
  });

  it('está "En publicación" por defecto', () => {
    expect(comic.status).toBe('ongoing');
    expect(comic.statusLabel).toBe('En publicación');
  });

  it('encuentra un capítulo por número', () => {
    expect(comic.getChapter(1)?.title).toBe('Cap 1');
    expect(comic.getChapter(9)).toBeUndefined();
  });
});
