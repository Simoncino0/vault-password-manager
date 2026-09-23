import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Home → rimanda al login
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  // 🔓 Rotte pubbliche
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then((m) => m.RegisterComponent),
  },

  // 🔒 Rotte protette (richiedono token valido)
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'categories',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./categories/category-list/category-list.component').then(
        (m) => m.CategoryListComponent,
      ),
  },
  {
    path: 'vault',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./vault/password-list/password-list.component').then((m) => m.PasswordListComponent),
  },
  {
    path: 'vault/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./vault/password-form/password-form.component').then((m) => m.PasswordFormComponent),
  },
  {
    path: 'vault/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./vault/password-form/password-form.component').then((m) => m.PasswordFormComponent),
  },
  {
    path: 'generator',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./generator/generator.component').then((m) => m.GeneratorComponent),
  },

  // Qualsiasi URL inesistente → login
  { path: '**', redirectTo: '/login' },
];
