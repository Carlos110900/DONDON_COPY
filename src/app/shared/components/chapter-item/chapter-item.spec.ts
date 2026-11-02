import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Chapter } from '../../models/chapter';

import { ChapterItem } from './chapter-item';

describe('ChapterItem', () => {
  let component: ChapterItem;
  let fixture: ComponentFixture<ChapterItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChapterItem],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ChapterItem);
    fixture.componentRef.setInput('comicId', 'comic-1');
    fixture.componentRef.setInput('chapter', new Chapter(1, 'Capítulo 1', '/chapter.pdf'));
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
