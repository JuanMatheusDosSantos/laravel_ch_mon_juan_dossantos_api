// import {inject} from '@angular/core';
// import {CanActivateFn, Router} from '@angular/router';
// import {AuthService} from './auth'; // <‐‐ Ajusta tu ruta
// export const adminGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);
// // Comprobamos si es admin usando el método que tengas en tu servicio
//   if (authService.isAdmin()) {
//     return true; // ¡Adelante, puedes pasar!
//   }
// // Si no es admin (o no está logueado), lo mandamos a la página principal
// // (Opcional: podrías mostrar aquí un Toast/Alerta de "Acceso Denegado")
//   router.navigate(['/']);
//   return false; // Bloqueamos la navegación a la ruta /admin
// };
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
