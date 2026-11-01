import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { ChapterItem } from '../../../shared/components/chapter-item/chapter-item';
import { DataState } from '../../../shared/components/data-state/data-state';
import { Heart } from '../../../shared/components/heart/heart';
import { ComicRepository } from '../../../shared/repositories/comic-repository';
import { loadResource } from '../../../shared/utils/load-resource';

@Component({
  selector: 'app-detail',
  imports: [ChapterItem, DataState, Heart, RouterLink],
  templateUrl: './detail.html',
  styleUrl: './detail.scss',
})
export class Detail {
  private readonly route = inject(ActivatedRoute);
  private readonly repository = inject(ComicRepository);

  private readonly resource = loadResource(
    this.route.paramMap.pipe(map((params) => params.get('id') ?? '')),
    (id) => this.repository.getById(id),
  );

  protected readonly comic = this.resource.data;
  protected readonly loading = this.resource.loading;
  protected readonly error = this.resource.error;

  protected reload(): void {
    this.resource.reload();
  }
}
