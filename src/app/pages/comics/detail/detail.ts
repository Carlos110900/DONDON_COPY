import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ChapterItem } from '../../../shared/components/chapter-item/chapter-item';
import { Heart } from '../../../shared/components/heart/heart';
import { ComicRepository } from '../../../shared/repositories/comic-repository';

@Component({
  selector: 'app-detail',
  imports: [ChapterItem, Heart, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
})
export class Detail {
  private readonly route = inject(ActivatedRoute);
  private readonly repository = inject(ComicRepository);

  readonly comic = toSignal(
    this.route.paramMap.pipe(map((params) => this.repository.getById(params.get('id') ?? ''))),
  );
}
