import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import {AuthService} from './auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si no hay token ni siquiera esperamos
  if (!authService.getAccessToken()) {
    router.navigate(['/']);
    return false;
  }

  // Esperamos a tener el usuario cargado antes de decidir
  return authService.waitForUser().pipe(
    map(user => {
      if (user && (user as any).role === 'admin') {
        return true;
      }
      router.navigate(['/']);
      return false;
    })
  );
};
