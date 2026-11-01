import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { errorInterceptor } from './shared/api/error-interceptor';
import { ComicRepository } from './shared/repositories/comic-repository';
import { HttpComicRepository } from './shared/repositories/http-comic-repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([errorInterceptor])),
    { provide: ComicRepository, useClass: HttpComicRepository },
  ],
};
