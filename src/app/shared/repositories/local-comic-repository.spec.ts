import { TestBed } from '@angular/core/testing';

import { LocalComicRepository } from './local-comic-repository';

describe('LocalComicRepository', () => {
  let service: LocalComicRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalComicRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose the available Batman chapters with their PDF paths', () => {
    const comic = service.getById('absolute-batman');

    expect(comic?.chapters).toHaveLength(4);
    expect(comic?.chapters[0].title).toBe('Absolute Batman #1');
    expect(comic?.chapters[0].pdfUrl).toBe(
      '/comics/absolute-batman/chapters/Absolute_Batman_1.pdf',
    );
  });
});
