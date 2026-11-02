import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpComicRepository } from './http-comic-repository';

describe('HttpComicRepository', () => {
  let repository: HttpComicRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    repository = TestBed.inject(HttpComicRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('loads and maps comics from the API', async () => {
    const comics = firstValueFrom(repository.getAll());
    const request = http.expectOne(`${environment.apiUrl}/comics`);

    expect(request.request.method).toBe('GET');
    request.flush([
      {
        id: 'my-comic',
        title: 'Mi cómic',
        description: 'Una descripción',
        cover: '/cover.jpg',
        publisher: 'Editorial',
        genres: ['Aventura'],
        status: 'ongoing',
        involved: [{ name: 'Ana', role: 'writer' }],
        chapters: [{ number: 1, title: 'Capítulo 1', pdfUrl: '/chapter.pdf' }],
      },
    ]);

    const [comic] = await comics;
    expect(comic.id).toBe('my-comic');
    expect(comic.writers[0].name).toBe('Ana');
    expect(comic.chapters[0].title).toBe('Capítulo 1');
  });
});
