import { Routes } from '@angular/router';
import { ComicForm } from './pages/admin/comic-form/comic-form';
import { ComicList } from './pages/admin/comic-list/comic-list';
import { UserList } from './pages/admin/user-list/user-list';
import { Detail } from './pages/comics/detail/detail';
import { Favorites } from './pages/comics/favorites/favorites';
import { Home } from './pages/comics/home/home';
import { Reader } from './pages/comics/reader/reader';
import { Dashboard } from './pages/dashboard/dashboard';
import { Landing } from './pages/landing/landing';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { pendingChangesGuard } from './shared/guards/pending-changes-guard';
import { permissionGuard } from './shared/guards/permission-guard';

export const routes: Routes = [
  { path: '', component: Landing, title: 'DonDoDontonbori' },
  { path: 'login', component: Login, title: 'Iniciar sesión' },
  { path: 'registro', component: Register, title: 'Crear cuenta' },
  { path: 'catalogo', component: Home, title: 'Cómics' },
  { path: 'comics/:id', component: Detail, title: 'Detalle del cómic' },
  { path: 'comics/:id/leer/:chapter', component: Reader, title: 'Lector' },
  {
    path: 'favoritos',
    component: Favorites,
    title: 'Mis favoritos',
    canActivate: [permissionGuard],
    data: { roles: ['reader', 'publisher', 'admin'] },
  },

  {
    path: 'panel',
    canActivate: [permissionGuard],
    data: { roles: ['publisher', 'admin'] },
    children: [
      { path: '', component: Dashboard, title: 'Panel' },
      { path: 'comics', component: ComicList, title: 'Mis cómics' },
      {
        path: 'comics/nuevo',
        component: ComicForm,
        title: 'Nuevo cómic',
        canDeactivate: [pendingChangesGuard],
      },
      {
        path: 'comics/:id/editar',
        component: ComicForm,
        title: 'Editar cómic',
        canDeactivate: [pendingChangesGuard],
      },
      {
        path: 'usuarios',
        component: UserList,
        title: 'Usuarios',
        canActivate: [permissionGuard],
        data: { roles: ['admin'] },
      },
    ],
  },
  { path: 'comics', component: ComicList, title: 'Mis cómics' },
  {
    path: 'comics/nuevo',
    component: ComicForm,
    title: 'Nuevo cómic',
    canDeactivate: [pendingChangesGuard],
  },
  {
    path: 'comics/:id/editar',
    component: ComicForm,
    title: 'Editar cómic',
    canDeactivate: [pendingChangesGuard],
  },

  { path: '**', redirectTo: '' },
];
