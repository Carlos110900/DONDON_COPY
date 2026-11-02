import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { of } from 'rxjs';
import { ComicInput } from '../../../shared/api/comic.dto';
import { DataState } from '../../../shared/components/data-state/data-state';
import { FormField } from '../../../shared/components/form-field/form-field';
import { PendingChanges } from '../../../shared/guards/pending-changes-guard';
import { Comic, DEFAULT_COVER } from '../../../shared/models/comic';
import { COMIC_STATUSES, ComicStatus } from '../../../shared/models/comic-status';
import { ComicRepository } from '../../../shared/repositories/comic-repository';
import { ComicStore } from '../../../shared/services/comic-store';
import { TagServices } from '../../../shared/services/tag-services';
import { Toast } from '../../../shared/services/toast/toast';
import { compressImage } from '../../../shared/utils/image';
import { loadResource } from '../../../shared/utils/load-resource';
import { slugify } from '../../../shared/utils/slugify';
import {
  coverFile,
  minSelected,
  namesList,
  notBlank,
  parseNames,
  uniqueComicId,
} from '../../../shared/validators/form-validators';

const SYNOPSIS_MINIMA = 20;

@Component({
  selector: 'app-comic-form',
  imports: [ReactiveFormsModule, RouterLink, FormField, DataState],
  templateUrl: './comic-form.html',
  styleUrl: './comic-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComicForm implements PendingChanges {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly repository = inject(ComicRepository);
  private readonly store = inject(ComicStore);
  private readonly toast = inject(Toast);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly tags = inject(TagServices).tags;
  protected readonly statuses = COMIC_STATUSES;
  protected readonly submitting = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly cover = signal(DEFAULT_COVER);

  /** null = alta; con valor = edición. */
  private readonly editingId = this.route.snapshot.paramMap.get('id');
  protected readonly isEdit = this.editingId !== null;
  private savedCover = DEFAULT_COVER;
  private objectUrl: string | null = null;

  readonly form = this.fb.group({
    title: ['', [Validators.required, notBlank, Validators.minLength(3), Validators.maxLength(80)]],
    synopsis: [
      '',
      [
        Validators.required,
        notBlank,
        Validators.minLength(SYNOPSIS_MINIMA),
        Validators.maxLength(500),
      ],
    ],
    publisher: ['', [Validators.required, notBlank]],
    writers: ['', [Validators.required, notBlank, namesList]],
    artists: ['', [Validators.required, notBlank, namesList]],
    status: this.fb.control<ComicStatus>('ongoing'),
    genres: this.fb.control<string[]>([], minSelected(1)),
    cover: new FormControl<File | null>(null, coverFile),
  });

  private readonly resource = this.editingId
    ? loadResource(of(this.editingId), (id) => this.repository.getById(id))
    : null;
  protected readonly loading = computed(() => this.resource?.loading() ?? false);
  protected readonly loadError = computed(() => this.resource?.error() ?? null);

  constructor() {
    this.destroyRef.onDestroy(() => this.releaseObjectUrl());

    if (!this.isEdit) {
      this.form.controls.title.addAsyncValidators(uniqueComicId(this.repository));
    }

    effect(() => {
      const comic = this.resource?.data();
      if (!comic) return;
      this.form.reset(this.toFormValue(comic));
      this.savedCover = comic.cover;
      this.cover.set(comic.cover);
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

  protected isSelected(name: string): boolean {
    return this.form.controls.genres.value.includes(name);
  }

  protected toggleTag(name: string): void {
    const control = this.form.controls.genres;
    control.setValue(
      this.isSelected(name)
        ? control.value.filter((tag) => tag !== name)
        : [...control.value, name],
    );
    control.markAsDirty();
    control.markAsTouched();
  }

  protected onCoverChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.item(0) ?? null;
    const control = this.form.controls.cover;
    control.setValue(file);
    control.markAsDirty();
    control.markAsTouched();

    this.releaseObjectUrl();
    if (file && control.valid) {
      this.objectUrl = URL.createObjectURL(file);
      this.cover.set(this.objectUrl);
    } else {
      this.cover.set(this.savedCover);
    }
  }

  protected onCoverError(): void {
    if (this.cover() !== DEFAULT_COVER) {
      this.cover.set(DEFAULT_COVER);
    }
  }

  protected async submit(): Promise<void> {
    if (this.submitting()) return;

    if (this.form.invalid || this.form.pending) {
      this.form.markAllAsTouched();
      this.toast.show('Revisa los campos marcados.', 'error');
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    try {
      const input = await this.toInput();
      if (this.editingId) {
        await this.store.update(this.editingId, input);
      } else {
        await this.store.create(slugify(input.title), input);
      }

      this.form.markAsPristine();
      this.toast.show(
        this.isEdit ? 'Cómic actualizado correctamente.' : 'Cómic creado correctamente.',
      );
      await this.router.navigate(['/panel/comics']);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar el cómic.';
      this.submitError.set(message);
      this.toast.show(message, 'error');
    } finally {
      this.submitting.set(false);
    }
  }

  private async toInput(): Promise<ComicInput> {
    const value = this.form.getRawValue();
    const cover = value.cover ? await compressImage(value.cover) : this.savedCover;

    return {
      title: value.title.trim(),
      description: value.synopsis.trim(),
      publisher: value.publisher.trim(),
      cover,
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
      synopsis: comic.description,
      publisher: comic.publisher,
      writers: comic.writers.map((person) => person.name).join(', '),
      artists: comic.artists.map((person) => person.name).join(', '),
      status: comic.status,
      genres: [...comic.genres],
    };
  }

  private releaseObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
