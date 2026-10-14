export class Chapter {
  constructor(
    public readonly number: number,
    public readonly title: string,
    public readonly pdfUrl: string,
  ) {}

  get label(): string {
    return `Capítulo ${this.number.toString().padStart(2, '0')}`;
  }
}
