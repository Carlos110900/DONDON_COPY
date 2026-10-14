import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Chapter } from '../../models/chapter';

@Component({
  selector: 'app-chapter-item',
  imports: [RouterLink],
  templateUrl: './chapter-item.html',
  styleUrl: './chapter-item.scss',
})
export class ChapterItem {
  readonly comicId = input.required<string>();
  readonly chapter = input.required<Chapter>();
}
