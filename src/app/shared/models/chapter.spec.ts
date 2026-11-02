import { Chapter } from './chapter';

describe('Chapter', () => {
  it('should create an instance', () => {
    expect(new Chapter(1, 'Capítulo 1', '/capitulo-1.pdf')).toBeTruthy();
  });
});
