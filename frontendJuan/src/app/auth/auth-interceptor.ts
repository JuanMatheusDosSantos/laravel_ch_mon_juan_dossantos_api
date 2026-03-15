import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core'; // Ajusta la ruta si es necesario
import { catchError, switchMap, throwError, of } from 'rxjs';
import {AuthService} from './auth';
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = localStorage.getItem('access_token'); // O auth.getAccessToken()
// 1. Clona la petición y añade el token si existe
  let request = req;
  if (token) {
    request = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(request).pipe(
    catchError((err: HttpErrorResponse) => {


      if (req.url.includes('/login') && err.status === 401) {
        return throwError(() => err);
      }


      // if (req.url.includes('/refresh')) {
      //   auth.logout(); // Asumo que esto limpia y redirige
      //   return throwError(() => err);
      // }

      if (req.url.includes('/refresh')) {
        console.log('refresh falló, status:', err.status);
        localStorage.clear();
        // window.location.href = '/login';
        return throwError(() => err);
      }

      if (err.status === 401) {
        // 1. SI EL ERROR VIENE DE LOGIN O REFRESH, NO REINTENTAR
        // Esto evita que el fallo de contraseña te mande a un bucle de refresh
        // if (req.url.includes('/login') || req.url.includes('/refresh')) {
        //   return throwError(() => err);
        // }

        if (req.url.includes('/login') || req.url.includes('/refresh') || req.url.includes('/logout')) {
          // 👆 Agregá /logout también para cortar el bucle
          localStorage.clear();
          window.location.href = '/login';
          return throwError(() => err);
        }

        // 2. SI NO TENEMOS TOKEN, NO HAY NADA QUE REFRESCAR
        const currentToken = localStorage.getItem('access_token');
        if (!currentToken) {
          auth.logout().subscribe(); // Limpieza normal
          return throwError(() => err);
        }

        // 3. INTENTO DE REFRESH (Solo para peticiones de datos normales)
        // return auth.refreshToken().pipe(
        //   switchMap((res: any) => {
        //     localStorage.setItem('access_token', res.access_token);
        //     const newReq = req.clone({
        //       setHeaders: { Authorization: `Bearer ${res.access_token}` }
        //     });
        //     return next(newReq);
        //   }),

        return auth.refreshToken().pipe(
          switchMap((res: any) => {
            localStorage.setItem('access_token', res.access_token);
            const newReq = req.clone({  // 👈 usa req, que es la original sin token
              setHeaders: { Authorization: `Bearer ${res.access_token}` }
            });
            return next(newReq);
          }),

          catchError((refreshErr) => {
            // Si el refresh falla, limpiamos localmente sin hacer peticiones HTTP
            // para evitar el bucle infinito en el logout
            localStorage.clear();
            window.location.href = '/login';
            return throwError(() => refreshErr);
          })
        );
      }

// Cualquier otro error (500, 404, etc), lo dejamos pasar
      return throwError(() => err);
    })
  );
};
