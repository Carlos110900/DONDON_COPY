import { TestBed } from '@angular/core/testing';

import { TagServices } from './tag-services';

describe('TagServices', () => {
  let service: TagServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
