import { Comic } from '../../shared/models/comic';

export abstract class ComicRepository {
  abstract getAll(): readonly Comic[];
  abstract getById(id: string): Comic | undefined;
}
