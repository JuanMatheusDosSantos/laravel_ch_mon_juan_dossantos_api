import { Observable, map } from 'rxjs';
import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Petition} from './models/petition'; // Ajusta la ruta a tu modelo
@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private readonly API_ADMIN_URL = 'http://localhost:8000/api/admin/peticiones';
  /**
   * Obtiene TODAS las peticiones saltándose las restricciones de usuario
   */
  getPeticionesAdmin(): Observable<Petition[]> {
    return this.http.get<{ success: boolean, data: Petition[] }>(this.API_ADMIN_URL).pipe(
      map(res => res.data) // Extraemos directamente el array para que el componente trabaje limpio
  );
  }
  /**
   * Elimina cualquier petición a la fuerza (Fuerza bruta del admin)
   */
  deletePeticionAdmin(id: number): Observable<any> {
    return this.http.delete(`${this.API_ADMIN_URL}/${id}`);
  }
}
