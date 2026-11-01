import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
import { DataState } from '../../../shared/components/data-state/data-state';
import { PdfViewer } from '../../../shared/components/pdf-viewer/pdf-viewer';
import { ComicRepository } from '../../../shared/repositories/comic-repository';
import { loadResource } from '../../../shared/utils/load-resource';

@Component({
  selector: 'app-reader',
  imports: [DataState, PdfViewer, RouterLink],
  templateUrl: './reader.html',
  styleUrl: './reader.scss',
})
export class Reader {
  private readonly route = inject(ActivatedRoute);
  private readonly repository = inject(ComicRepository);

  private readonly params = toSignal(this.route.paramMap, { requireSync: true });

  private readonly resource = loadResource(
    this.route.paramMap.pipe(
      map((params) => params.get('id') ?? ''),
      distinctUntilChanged(),
    ),
    (id) => this.repository.getById(id),
  );

  readonly comic = this.resource.data;
  readonly loading = this.resource.loading;
  readonly error = this.resource.error;

  readonly chapter = computed(() => this.comic()?.getChapter(Number(this.params().get('chapter'))));
  readonly previous = computed(() => {
    const current = this.chapter();
    return current ? this.comic()?.getChapter(current.number - 1) : undefined;
  });
  readonly next = computed(() => {
    const current = this.chapter();
    return current ? this.comic()?.getChapter(current.number + 1) : undefined;
  });

  reload(): void {
    this.resource.reload();
  }
}
