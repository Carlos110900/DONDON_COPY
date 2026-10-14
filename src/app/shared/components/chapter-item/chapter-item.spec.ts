import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChapterItem } from './chapter-item';

describe('ChapterItem', () => {
  let component: ChapterItem;
  let fixture: ComponentFixture<ChapterItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChapterItem],
    }).compileComponents();

    fixture = TestBed.createComponent(ChapterItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
