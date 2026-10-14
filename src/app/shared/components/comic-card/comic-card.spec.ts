import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComicCard } from './comic-card';

describe('ComicCard', () => {
  let component: ComicCard;
  let fixture: ComponentFixture<ComicCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComicCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ComicCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
