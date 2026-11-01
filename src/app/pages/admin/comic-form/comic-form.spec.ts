import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ComicRepository } from '../../../shared/repositories/comic-repository';
import { LocalComicRepository } from '../../../shared/repositories/local-comic-repository';

import { ComicForm } from './comic-form';

describe('ComicForm', () => {
  let component: ComicForm;
  let fixture: ComponentFixture<ComicForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComicForm],
      providers: [provideRouter([]), { provide: ComicRepository, useClass: LocalComicRepository }],
    }).compileComponents();

    fixture = TestBed.createComponent(ComicForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('empieza inválido y en estado "En publicación"', () => {
    expect(component.form.invalid).toBe(true);
    expect(component.form.controls.status.value).toBe('ongoing');
  });

  it('exige sinopsis de al menos 20 caracteres', () => {
    component.form.patchValue({ synopsis: 'muy corta' });

    expect(component.form.controls.synopsis.hasError('minlength')).toBe(true);
  });

  it('exige al menos un tag', () => {
    expect(component.form.controls.genres.hasError('minSelected')).toBe(true);

    component.form.patchValue({ genres: ['Acción'] });
    expect(component.form.controls.genres.valid).toBe(true);
  });

  it('rechaza una portada que no es imagen y acepta no subir ninguna', () => {
    const cover = component.form.controls.cover;
    expect(cover.valid).toBe(true);

    cover.setValue(new File(['x'], 'nota.txt', { type: 'text/plain' }));
    expect(cover.hasError('coverType')).toBe(true);
  });

  it('es válido con todos los datos obligatorios', () => {
    component.form.patchValue({
      title: 'Mi cómic',
      synopsis: 'Una sinopsis con más de veinte caracteres.',
      publisher: 'Editorial',
      writers: 'Ana',
      artists: 'Luis',
      genres: ['Acción'],
    });

    expect(component.form.valid).toBe(true);
  });
});
