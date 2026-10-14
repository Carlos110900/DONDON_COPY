import { Chapter } from './chapter';
import { Involved } from './involved/involved';

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
  ) {}

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
