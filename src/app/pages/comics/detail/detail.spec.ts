import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ComicRepository } from '../../../shared/repositories/comic-repository';

import { Detail } from './detail';

const repositoryStub = {
  getAll: () => of([]),
  getById: () => of(),
  create: () => of(),
  update: () => of(),
  remove: () => of(),
  exists: () => of(false),
};

describe('Detail', () => {
  let component: Detail;
  let fixture: ComponentFixture<Detail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detail],
      providers: [provideRouter([]), { provide: ComicRepository, useValue: repositoryStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(Detail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
