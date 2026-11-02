import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Comic } from '../../models/comic';
import { Heart } from '../heart/heart';

@Component({
  selector: 'app-comic-card',
  imports: [Heart, RouterLink],
  templateUrl: './comic-card.html',
  styleUrl: './comic-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComicCard {
  readonly comic = input.required<Comic>();
  protected readonly coverState = signal<'loading' | 'loaded' | 'error'>('loading');
  private readonly image = viewChild.required<ElementRef<HTMLImageElement>>('cover');

  constructor() {
    // Con SSR la imagen puede terminar de cargar antes de que Angular escuche (load)
    afterNextRender(() => {
      const img = this.image().nativeElement;
      if (img.complete) {
        this.coverState.set(img.naturalWidth > 0 ? 'loaded' : 'error');
      }
    });
  }
}
