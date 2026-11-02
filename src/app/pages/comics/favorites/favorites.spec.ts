import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ComicRepository } from '../../../shared/repositories/comic-repository';

import { Favorites } from './favorites';

const repositoryStub = {
  getAll: () => of([]),
  getById: () => of(),
  create: () => of(),
  update: () => of(),
  remove: () => of(),
  exists: () => of(false),
};

describe('Favorites', () => {
  let component: Favorites;
  let fixture: ComponentFixture<Favorites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Favorites],
      providers: [{ provide: ComicRepository, useValue: repositoryStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(Favorites);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
