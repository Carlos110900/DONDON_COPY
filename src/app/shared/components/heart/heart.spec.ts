import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Heart } from './heart';

describe('Heart', () => {
  let fixture: ComponentFixture<Heart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Heart] }).compileComponents();
    fixture = TestBed.createComponent(Heart);
    fixture.componentRef.setInput('comicId', 'comic-1');
    await fixture.whenStable();
  });

  it('toggles the favorite state', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    button.click();
    fixture.detectChanges();

    expect(button.getAttribute('aria-pressed')).toBe('true');
  });
});
