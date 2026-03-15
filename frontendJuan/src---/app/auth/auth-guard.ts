import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth';
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Verificamos si hay token directamente para evitar el delay del estado interno
  const token = localStorage.getItem('token');

  if (auth.isAuthenticated() || !!token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
