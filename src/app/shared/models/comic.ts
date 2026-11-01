import { Chapter } from './chapter';
import { COMIC_STATUSES, ComicStatus } from './comic-status';
import { Involved } from './involved/involved';

export const DEFAULT_COVER = '/recursos/portada-default.jpg';

export class Comic {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly cover: string,
    public readonly publisher: string,
    public readonly genres: readonly string[],
    public readonly involved: readonly Involved[],
    public readonly chapters: readonly Chapter[],
    public readonly status: ComicStatus = 'ongoing',
  ) {}

  get statusLabel(): string {
    return COMIC_STATUSES.find((s) => s.value === this.status)?.label ?? '';
  }

  get writers(): Involved[] {
    return this.involved.filter((person) => person.isWriter);
  }

  get artists(): Involved[] {
    return this.involved.filter((person) => person.isArtist);
  }

  getChapter(number: number): Chapter | undefined {
    return this.chapters.find((chapter) => chapter.number === number);
  }
}
