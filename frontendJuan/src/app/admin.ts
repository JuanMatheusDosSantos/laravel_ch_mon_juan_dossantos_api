import {Observable, map, tap} from 'rxjs';
import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Categoria, Petition} from './models/petition';
import {Users} from './admin/users/users'; // Ajusta la ruta a tu modelo
@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  #peticiones = signal<Petition[]>([]);
  #users = signal<Users[]>([]);
  loading = signal<boolean>(false);
  private readonly API_URL = 'http://localhost:8000/api/petitions';
  private readonly ADMIN_API_URL = 'http://localhost:8000/api/admin/petitions';
  private readonly ADMIN_USER_API_URL = 'http://localhost:8000/api/admin/users';

  fetchPeticionesAdmin() {
    this.loading.set(true);
    return this.http.get<any>(this.ADMIN_API_URL).pipe(
      map(res => {
        const rawData = res.data ?? res;
        const data = Array.isArray(rawData) ? rawData : [];

        return data.map((p: any) => {
          // 1. Intentamos sacar los archivos de 'files' (aplanándolos) o de 'file'
          let normalizedFiles = [];

          if (Array.isArray(p.files)) {
            // .flat() convierte [[obj]] en [obj]
            normalizedFiles = p.files.flat();
          } else if (p.file) {
            // Si 'file' es un objeto único, lo metemos en un array
            // Si ya es un array, lo aplanamos también
            normalizedFiles = Array.isArray(p.file) ? p.file.flat() : [p.file];
          }

          return {
            ...p,
            files: normalizedFiles
          };
        });
      }),
      tap(peticiones => {
        this.#peticiones.set(peticiones);
        this.loading.set(false);
      })
    );
  }

  getCategories() {
    return this.http.get<Categoria[]>(`${this.API_URL}/categories`);
  }
  getById(id: number) {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map(res => {
        const p = res.data ?? res;

        // 1. Si existe 'file' (singular), lo convertimos en un array plano
        if (p.file) {
          p.files = Array.isArray(p.file) ? p.file.flat() : [p.file];
        }

        // 2. Si ya existe 'files' (plural), nos aseguramos de que no sea un array de arrays
        if (p.files && Array.isArray(p.files)) {
          p.files = p.files.flat(); // Convierte [[obj]] en [obj]
        }

        return p as Petition;
      })
    );
  }
  /**
   * Elimina cualquier petición a la fuerza (Fuerza bruta del admin)
   */
  fetchPeticionesFirmadas() {
    this.loading.set(true);
    return this.http.get<any>(`${this.API_URL}/mysignatures`).pipe(
      map(res => {
        const rawData = res.data ?? res;
        const data = Array.isArray(rawData) ? rawData : [];

        return data.map((p: any) => {
          let normalizedFiles = [];

          if (Array.isArray(p.files)) {
            normalizedFiles = p.files.flat();
          } else if (p.file) {
            normalizedFiles = Array.isArray(p.file) ? p.file.flat() : [p.file];
          }

          return { ...p, files: normalizedFiles };
        });
      }),
      tap(peticiones => {
        this.#peticiones.set(peticiones);
        this.loading.set(false);
      })
    );
  }
  deleteAdmin(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      tap(() => {
        this.#peticiones.update(list => list.filter(p => p.id !== id));
      })
    );
  }
  cambiarEstadoPeticion(id: number, estado: string) {
    return this.http.put<{ data: Petition }>(`${this.ADMIN_API_URL}/estado/${id}`, { status: estado }).pipe(
      tap(res => {
        this.#peticiones.update(list =>
          list.map(p => p.id === id ? { ...p, status: estado } : p)
        );
      })
    );
  }
  updateAdmin(id: number, formData: FormData) {
    formData.append('_method', 'PUT');
    return this.http.post<{ data: Petition }>(`${this.ADMIN_API_URL}/edit/${id}`, formData).pipe(
      tap(res => {
        this.#peticiones.update(list =>
          list.map(p => p.id === id ? res.data : p)
        );
      })
    );
  }

  getUsersAdmin() {
    return this.http.get(`${this.ADMIN_USER_API_URL}`);
  }
  getUserAdmin(id: number) {
    return this.http.get(`${this.ADMIN_USER_API_URL}/${id}`);
  }
  updateUserAdmin(id: number, formData: any) {
// Usamos PUT porque no enviamos archivos (imágenes), solo texto plano
    return this.http.put(`${this.ADMIN_USER_API_URL}/${id}`,formData);
  }
  deleteUserAdmin(id: number) {
    return this.http.delete(`${this.ADMIN_USER_API_URL}/${id}`);
  }
  roleUserAdmin(id:number){
    return this.http.put(`${this.ADMIN_USER_API_URL}/role/${id}`,{});
  }
}
