import { TestBed } from '@angular/core/testing';

import { SearchServices } from './search-services';

describe('SearchServices', () => {
  let service: SearchServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
