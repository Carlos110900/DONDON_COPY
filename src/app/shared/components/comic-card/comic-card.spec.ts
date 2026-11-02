import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Comic } from '../../models/comic';

import { ComicCard } from './comic-card';

describe('ComicCard', () => {
  let component: ComicCard;
  let fixture: ComponentFixture<ComicCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComicCard],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ComicCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput(
      'comic',
      new Comic('comic-1', 'Comic de prueba', 'Descripción', '/cover.jpg', 'Editorial', [], [], []),
    );
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('muestra la carga hasta que termina de cargar la portada', () => {
    expect(fixture.nativeElement.querySelector('.cover-status')?.textContent).toContain(
      'Cargando portada',
    );

    fixture.nativeElement.querySelector('img').dispatchEvent(new Event('load'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.cover-status')).toBeNull();
    expect(fixture.nativeElement.querySelector('img').classList).toContain('is-loaded');
  });

  it('muestra un mensaje si la portada no se puede cargar', () => {
    fixture.nativeElement.querySelector('img').dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.cover-status')?.textContent).toContain(
      'No se pudo cargar la portada',
    );
  });
});
