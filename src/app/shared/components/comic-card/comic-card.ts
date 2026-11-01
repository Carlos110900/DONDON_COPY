import { Component, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Comic } from '../../models/comic';
import { Heart } from '../heart/heart';

@Component({
  selector: 'app-comic-card',
  imports: [Heart, RouterLink],
  templateUrl: './comic-card.html',
  styleUrl: './comic-card.scss',
})
export class ComicCard {
  readonly comic = input.required<Comic>();
  protected readonly coverState = signal<'loading' | 'loaded' | 'error'>('loading');
}
