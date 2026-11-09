import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { errorInterceptor } from './shared/api/error-interceptor';
import { ComicRepository } from './shared/repositories/comic-repository';
import { HttpComicRepository } from './shared/repositories/http-comic-repository';
import { authInterceptor } from './interceptors/auth-interceptor';
import { Auth } from './shared/services/auth/auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor])),
    { provide: ComicRepository, useClass: HttpComicRepository },
    // Recupera la sesión del usuario al iniciar la aplicación
    provideAppInitializer(() => inject(Auth).restoreSession()),
  ],
};
