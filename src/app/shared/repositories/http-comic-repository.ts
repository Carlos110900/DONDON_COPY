import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ComicDto, ComicInput } from '../api/comic.dto';
import { toComic } from '../api/comic.mapper';
import { Comic } from '../models/comic';
import { ComicRepository } from './comic-repository';

@Injectable({ providedIn: 'root' })
export class HttpComicRepository extends ComicRepository {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/comics`;

  getAll(): Observable<Comic[]> {
    return this.http.get<ComicDto[]>(this.url).pipe(map((list) => list.map(toComic)));
  }

  getById(id: string): Observable<Comic> {
    return this.http.get<ComicDto>(this.itemUrl(id)).pipe(map(toComic));
  }

  create(id: string, input: ComicInput): Observable<Comic> {
    const body: ComicDto = { id, ...input, chapters: [] };
    return this.http.post<ComicDto>(this.url, body).pipe(map(toComic));
  }

  /** PATCH (no PUT) para no pisar los capítulos que el formulario no maneja. */
  update(id: string, input: ComicInput): Observable<Comic> {
    return this.http.patch<ComicDto>(this.itemUrl(id), input).pipe(map(toComic));
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(this.itemUrl(id));
  }

  exists(id: string): Observable<boolean> {
    return this.http
      .get<ComicDto[]>(this.url, { params: { id } })
      .pipe(map((list) => list.length > 0));
  }

  private itemUrl(id: string): string {
    return `${this.url}/${encodeURIComponent(id)}`;
  }
}
