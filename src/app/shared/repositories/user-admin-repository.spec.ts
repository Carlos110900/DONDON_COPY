import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

import { UserAdminRepository } from './user-admin-repository';

describe('UserAdminRepository', () => {
  it('lista los usuarios desde la API', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const repository = TestBed.inject(UserAdminRepository);
    const http = TestBed.inject(HttpTestingController);

    const users = firstValueFrom(repository.getAll());
    http.expectOne(`${environment.authUrl}/users`).flush({
      success: true,
      data: [
        {
          id: '1',
          name: 'Ana',
          email: 'a@a.com',
          role: 'reader',
          status: 'active',
          creationDate: '',
        },
      ],
    });

    expect((await users)[0].name).toBe('Ana');
    http.verify();
  });
});
