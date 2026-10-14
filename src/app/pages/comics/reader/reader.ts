import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PdfViewer } from '../../../shared/components/pdf-viewer/pdf-viewer';
import { ComicRepository } from '../../../shared/repositories/comic-repository';

@Component({
  selector: 'app-reader',
  imports: [PdfViewer, RouterLink],
  templateUrl: './reader.html',
  styleUrl: './reader.scss',
})
export class Reader {
  private readonly route = inject(ActivatedRoute);
  private readonly repository = inject(ComicRepository);

  private readonly params = toSignal(this.route.paramMap, { requireSync: true });

  readonly comic = computed(() => this.repository.getById(this.params().get('id') ?? ''));
  readonly chapter = computed(() => this.comic()?.getChapter(Number(this.params().get('chapter'))));
  readonly previous = computed(() => {
    const current = this.chapter();
    return current ? this.comic()?.getChapter(current.number - 1) : undefined;
  });
  readonly next = computed(() => {
    const current = this.chapter();
    return current ? this.comic()?.getChapter(current.number + 1) : undefined;
  });
}
