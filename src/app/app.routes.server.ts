import { RenderMode, ServerRoute } from '@angular/ssr';

// La sesión vive en el navegador (token en localStorage), así que el servidor no puede saber
// quién es el usuario. Las pantallas que dependen de la sesión se renderizan en el cliente;
// de lo contrario, al recargar /panel el servidor vería a un "visitante" y mandaría al login.
export const serverRoutes: ServerRoute[] = [
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'registro', renderMode: RenderMode.Client },
  { path: 'favoritos', renderMode: RenderMode.Client },
  { path: 'panel', renderMode: RenderMode.Client },
  { path: 'panel/**', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Server },
];
