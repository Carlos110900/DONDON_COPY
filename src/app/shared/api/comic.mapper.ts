import { Chapter } from '../models/chapter';
import { Comic } from '../models/comic';
import { Involved } from '../models/involved/involved';
import { ComicDto } from './comic.dto';

export function toComic(dto: ComicDto): Comic {
  return new Comic(
    dto.id,
    dto.title,
    dto.description,
    dto.cover,
    dto.publisher,
    dto.genres ?? [],
    dto.status,
    (dto.involved ?? []).map((i) => new Involved(i.name, i.role)),
    (dto.chapters ?? []).map((c) => new Chapter(c.number, c.title, c.pdfUrl)),
  );
}
