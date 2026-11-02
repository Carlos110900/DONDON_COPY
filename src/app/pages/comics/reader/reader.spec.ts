import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ComicRepository } from '../../../shared/repositories/comic-repository';

import { Reader } from './reader';

const repositoryStub = {
  getAll: () => of([]),
  getById: () => of(),
  create: () => of(),
  update: () => of(),
  remove: () => of(),
  exists: () => of(false),
};

describe('Reader', () => {
  let component: Reader;
  let fixture: ComponentFixture<Reader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reader],
      providers: [provideRouter([]), { provide: ComicRepository, useValue: repositoryStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(Reader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
