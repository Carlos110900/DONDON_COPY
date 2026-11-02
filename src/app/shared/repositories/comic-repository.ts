import { Observable } from 'rxjs';
import { ComicInput } from '../api/comic.dto';
import { Comic } from '../models/comic';

export abstract class ComicRepository {
  abstract getAll(): Observable<Comic[]>;
  abstract getById(id: string): Observable<Comic>;
  abstract create(id: string, input: ComicInput): Observable<Comic>;
  abstract update(id: string, input: ComicInput): Observable<Comic>;
  abstract remove(id: string): Observable<void>;
  abstract exists(id: string): Observable<boolean>;
}
