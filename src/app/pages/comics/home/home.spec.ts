import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EMPTY, of } from 'rxjs';
import { ComicRepository } from '../../../shared/repositories/comic-repository';

import { Home } from './home';

const repositoryStub = {
  getAll: () => of([]),
  getById: () => EMPTY,
  create: () => EMPTY,
  update: () => EMPTY,
  remove: () => EMPTY,
  exists: () => of(false),
};

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), { provide: ComicRepository, useValue: repositoryStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
