import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormField } from '../../../shared/components/form-field/form-field';
import { HasPendingChanges } from '../../../shared/guards/pending-changes-guard';
import { DEFAULT_COVER } from '../../../shared/models/comic';
import { COMIC_STATUSES, ComicStatus } from '../../../shared/models/comic-status';
import { ComicRepository } from '../../../shared/repositories/comic-repository';
import { TagServices } from '../../../shared/services/tag-services';
import { Toast } from '../../../shared/services/toast/toast';
import { coverFile, minSelected, notBlank } from '../../../shared/validators/form-validators';

const SYNOPSIS_MINIMA = 20;

@Component({
  selector: 'app-comic-form',
  imports: [ReactiveFormsModule, RouterLink, FormField],
  templateUrl: './comic-form.html',
  styleUrl: './comic-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComicForm implements HasPendingChanges {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly repository = inject(ComicRepository);
  private readonly toast = inject(Toast);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly tags = inject(TagServices).tags;
  protected readonly statuses = COMIC_STATUSES;
  protected readonly submitting = signal(false);
  protected readonly cover = signal(DEFAULT_COVER);
  protected readonly editingId = this.route.snapshot.paramMap.get('id');
  protected readonly isEdit = this.editingId !== null;
  private savedCover = DEFAULT_COVER;
  private objectUrl: string | null = null;

  readonly form = this.fb.group({
    title: ['', [Validators.required, notBlank]],
    synopsis: ['', [Validators.required, notBlank, Validators.minLength(SYNOPSIS_MINIMA)]],
    publisher: ['', [Validators.required, notBlank]],
    writers: ['', [Validators.required, notBlank]],
    artists: ['', [Validators.required, notBlank]],
    status: this.fb.control<ComicStatus>('ongoing'),
    genres: this.fb.control<string[]>([], minSelected(1)),
    cover: new FormControl<File | null>(null, coverFile),
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.releaseObjectUrl());
    if (this.editingId) this.load(this.editingId);
  }

  hasPendingChanges(): boolean {
    return this.form.dirty;
  }

  protected isSelected(name: string): boolean {
    return this.form.controls.genres.value.includes(name);
  }

  protected toggleTag(name: string): void {
    const control = this.form.controls.genres;
    control.setValue(
      this.isSelected(name) ? control.value.filter((t) => t !== name) : [...control.value, name],
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

  // usar imagen por defecto si algo sale mal
  protected onCoverError(): void {
    if (this.cover() !== DEFAULT_COVER) {
      this.cover.set(DEFAULT_COVER);
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.show('Revisa los campos marcados.', 'error');
      return;
    }
    this.submitting.set(true);
    // ⚠️🐍Aui se usa el sefvicio para guardar, si siquiera tubieramos uno🐍⚠️
    this.form.markAsPristine(); //Evitar que el guardia haga preguntas estupidas (si podemos salir)
    this.toast.show(
      this.isEdit
        ? 'Cómic actualizado correctamente (demo).'
        : 'Cómic creado correctamente (demo).',
    );
    this.router.navigate(['/panel/comics']).finally(() => this.submitting.set(false));
  }

  private load(id: string): void {
    const comic = this.repository.getById(id);
    if (!comic) {
      this.toast.show('No se encontró el cómic que quieres editar.', 'error');
      this.router.navigate(['/panel/comics']);
      return;
    }
    this.form.patchValue({
      title: comic.title,
      synopsis: comic.description,
      publisher: comic.publisher,
      writers: comic.writers.map((p) => p.name).join(', '),
      artists: comic.artists.map((p) => p.name).join(', '),
      status: comic.status,
      genres: [...comic.genres],
    });
    this.savedCover = comic.cover;
    this.cover.set(comic.cover);
  }

  private releaseObjectUrl(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }
  }
}
