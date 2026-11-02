import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ComicRepository } from '../repositories/comic-repository';

import { ComicStore } from './comic-store';

const repositoryStub = {
  getAll: () => of([]),
  getById: () => of(),
  create: () => of(),
  update: () => of(),
  remove: () => of(),
  exists: () => of(false),
};

describe('ComicStore', () => {
  let service: ComicStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: ComicRepository, useValue: repositoryStub }],
    });
    service = TestBed.inject(ComicStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
