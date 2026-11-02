import { ComicRepository } from './comic-repository';
import { LocalComicRepository } from './local-comic-repository';

describe('ComicRepository', () => {
  it('exposes comics through its concrete implementation', () => {
    const repository: ComicRepository = new LocalComicRepository();
    const comic = repository.getById('absolute-batman');

    expect(comic).toBeTruthy();
    expect(repository.getAll()).toContain(comic);
  });
});
