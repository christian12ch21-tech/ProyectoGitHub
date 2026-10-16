import type { Routes } from '@angular/router';
import { adminGuard, authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'StyleHub — Catálogo',
    pathMatch: 'full',
    loadComponent: () => import('./paginas/catalogo').then((m) => m.Catalogo),
  },
  {
    path: 'carrito',
    title: 'Carrito',
    loadComponent: () => import('./paginas/carrito').then((m) => m.Carrito),
  },
  {
    path: 'login',
    title: 'Iniciar sesión',
    loadComponent: () => import('./paginas/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    title: 'Crear cuenta',
    loadComponent: () => import('./paginas/registro').then((m) => m.Registro),
  },
  {
    path: 'checkout',
    title: 'Finalizar compra',
    canActivate: [authGuard],
    loadComponent: () => import('./paginas/checkout').then((m) => m.Checkout),
  },
  {
    path: 'perfil',
    title: 'Mi perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./paginas/perfil').then((m) => m.Perfil),
  },
  {
    path: 'admin',
    title: 'Panel de administración',
    canActivate: [adminGuard],
    loadComponent: () => import('./paginas/admin').then((m) => m.Admin),
  },
  {
    path: '**',
    title: 'Página no encontrada',
    loadComponent: () =>
      import('./paginas/no-encontrada').then((m) => m.NoEncontrada),
  },
];
