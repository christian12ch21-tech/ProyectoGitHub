import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../servicios/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  return auth.sesion() ? true : inject(Router).createUrlTree(['/login']);
};

export const adminGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  return auth.esAdmin() ? true : inject(Router).createUrlTree(['/login']);
};
