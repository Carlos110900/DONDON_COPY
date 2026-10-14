import { Routes } from '@angular/router';
import { Detail } from './pages/comics/detail/detail';
import { Favorites } from './pages/comics/favorites/favorites';
import { Home } from './pages/comics/home/home';
import { Reader } from './pages/comics/reader/reader';

export const routes: Routes = [
  { path: '', component: Home, title: 'Cómics' },
  { path: 'favoritos', component: Favorites, title: 'Mis favoritos' },
  { path: 'comics/:id', component: Detail, title: 'Detalle del cómic' },
  { path: 'comics/:id/leer/:chapter', component: Reader, title: 'Lector' },
  { path: '**', redirectTo: '' },
];
