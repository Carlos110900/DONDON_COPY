import { TestBed } from '@angular/core/testing';

import { ComicStore } from './comic-store';

describe('ComicStore', () => {
  let service: ComicStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComicStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
