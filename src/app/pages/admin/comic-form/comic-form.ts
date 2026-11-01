import { Component, computed, effect, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { ApiError } from '../../../shared/api/api-error';
import { ComicInput } from '../../../shared/api/comic.dto';
import { DataState } from '../../../shared/components/data-state/data-state';
import { PendingChanges } from '../../../shared/guards/pending-changes-guard';
import { Comic, ComicStatus } from '../../../shared/models/comic';
import { ComicRepository } from '../../../shared/repositories/comic-repository';
import { ComicStore } from '../../../shared/services/comic-store';
import { Toast } from '../../../shared/services/toast/toast';
import { loadResource } from '../../../shared/utils/load-resource';
import { slugify } from '../../../shared/utils/slugify';
import {
  minSelected,
  namesList,
  noBlank,
  parseNames,
  publicAsset,
  uniqueComicId,
} from '../../../shared/validators/comic-validators';

type FieldName =
  'title' | 'description' | 'publisher' | 'cover' | 'status' | 'genres' | 'writers' | 'artists';

@Component({
  selector: 'app-comic-form',
  imports: [ReactiveFormsModule, RouterLink, DataState],
  templateUrl: './comic-form.html',
  styleUrl: './comic-form.scss',
})
export class ComicForm implements PendingChanges {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly repository = inject(ComicRepository);
  private readonly store = inject(ComicStore);
  private readonly toast = inject(Toast);

  /** null = alta; con valor = edición. */
  private readonly editingId = this.route.snapshot.paramMap.get('id');
  protected readonly isEdit = this.editingId !== null;

  protected readonly genreOptions = [
    'Acción',
    'Aventura',
    'Ciencia ficción',
    'Comedia',
    'Crimen',
    'Deportes',
    'Drama',
    'Fantasía',
    'Misterio',
    'Superhéroes',
    'Terror',
  ];

  protected readonly form = this.fb.group({
    title: ['', [Validators.required, noBlank, Validators.minLength(3), Validators.maxLength(80)]],
    description: [
      '',
      [Validators.required, noBlank, Validators.minLength(20), Validators.maxLength(500)],
    ],
    publisher: ['', [Validators.required, noBlank]],
    cover: ['', [Validators.required, publicAsset(['jpg', 'jpeg', 'png', 'webp'])]],
    status: this.fb.control<ComicStatus>('ongoing', Validators.required),
    genres: this.fb.control<string[]>([], minSelected(1)),
    writers: ['', [Validators.required, namesList]],
    artists: ['', [Validators.required, namesList]],
  });

  protected readonly saving = signal(false);
  protected readonly submitError = signal<string | null>(null);

  // En edición se carga el cómic desde la API; en alta no hay nada que cargar.
  private readonly resource = this.editingId
    ? loadResource(of(this.editingId), (id) => this.repository.getById(id))
    : null;
  protected readonly loading = computed(() => this.resource?.loading() ?? false);
  protected readonly loadError = computed(() => this.resource?.error() ?? null);

  constructor() {
    if (!this.isEdit) {
      // Solo en alta: el id nuevo (slug del título) no puede existir ya
      this.form.controls.title.addAsyncValidators(uniqueComicId(this.repository));
    }

    // Edición precargada: reset() rellena el formulario y lo deja pristine
    effect(() => {
      const comic = this.resource?.data();
      if (comic) this.form.reset(this.toFormValue(comic));
    });
  }

  hasPendingChanges(): boolean {
    return this.form.dirty;
  }

  protected reload(): void {
    this.resource?.reload();
  }

  protected slugPreview(): string {
    return slugify(this.form.controls.title.value) || 'mi-comic';
  }

  protected isGenreChecked(genre: string): boolean {
    return this.form.controls.genres.value.includes(genre);
  }

  protected toggleGenre(genre: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const control = this.form.controls.genres;
    control.setValue(
      checked ? [...control.value, genre] : control.value.filter((g) => g !== genre),
    );
    control.markAsDirty();
    control.markAsTouched();
  }

  protected errorMessage(name: FieldName): string | null {
    const control = this.form.controls[name];
    const errors = control.errors;
    if (!errors || !(control.touched || control.dirty)) return null;

    if (errors['required'] || errors['blank']) return 'Este campo es obligatorio.';
    if (errors['minlength'])
      return `Escribe al menos ${errors['minlength'].requiredLength} caracteres.`;
    if (errors['maxlength'])
      return `No puede pasar de ${errors['maxlength'].requiredLength} caracteres.`;
    if (errors['assetPath']) {
      const exts = (errors['assetPath'].extensions as string[]).map((e) => `.${e}`).join(', ');
      return `Usa una ruta dentro de public que empiece con "/" y termine en ${exts}.`;
    }
    if (errors['minSelected']) return 'Elige al menos un género.';
    if (errors['names'])
      return 'Cada nombre debe tener al menos 2 caracteres; sepáralos con comas.';
    if (errors['idTaken']) return 'Ya existe un cómic con ese título.';
    return 'Valor no válido.';
  }

  protected async submit(): Promise<void> {
    if (this.saving()) return;

    if (this.form.invalid || this.form.pending) {
      this.form.markAllAsTouched();
      this.toast.show('Revisa los campos marcados.', 'error');
      return;
    }

    this.saving.set(true);
    this.submitError.set(null);
    const input = this.toInput();

    try {
      if (this.editingId) {
        await this.store.update(this.editingId, input);
      } else {
        await this.store.create(slugify(input.title), input);
      }
      this.form.markAsPristine(); // para que el guard de salida no pregunte después de guardar
      this.toast.show(
        this.isEdit ? 'Cómic actualizado correctamente.' : 'Cómic creado correctamente.',
      );
      await this.router.navigate(['/panel/comics']);
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'No se pudo guardar el cómic.';
      this.submitError.set(message);
      this.toast.show(message, 'error');
    } finally {
      this.saving.set(false);
    }
  }

  private toInput(): ComicInput {
    const value = this.form.getRawValue();
    return {
      title: value.title.trim(),
      description: value.description.trim(),
      publisher: value.publisher.trim(),
      cover: value.cover.trim(),
      status: value.status,
      genres: value.genres,
      involved: [
        ...parseNames(value.writers).map((name) => ({ name, role: 'writer' as const })),
        ...parseNames(value.artists).map((name) => ({ name, role: 'artist' as const })),
      ],
    };
  }

  private toFormValue(comic: Comic) {
    return {
      title: comic.title,
      description: comic.description,
      publisher: comic.publisher,
      cover: comic.cover,
      status: comic.status,
      genres: [...comic.genres],
      writers: comic.writers.map((p) => p.name).join(', '),
      artists: comic.artists.map((p) => p.name).join(', '),
    };
  }
}
