import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map } from 'rxjs';
import {Categoria, Petition} from '../models/petition';
@Injectable({ providedIn: 'root' })
export class PetitionService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:8000/api/petitions';
// --- State (Signals) ---
// Store privado de peticiones
  #peticiones = signal<Petition[]>([]);
  loading = signal<boolean>(false);


  fetchPeticiones() {
    this.loading.set(true);
    return this.http.get<any>(this.API_URL).pipe(
      map(res => {
        // 1. Extraer los datos (Laravel suele envolver en 'data')
        const rawData = res.data ?? res;
        const data = Array.isArray(rawData) ? rawData : [];

        // 2. Normalizar cada petición
        return data.map((p: any) => {
          return {
            ...p,
            // Forzamos que 'files' sea un array siempre
            // Si llega 'file' desde el back (with('file')), lo metemos dentro
            files: p.files && p.files.length > 0
              ? p.files
              : (p.file ? [p.file] : [])
          };
        });
      }),
      tap(peticiones => {
        this.#peticiones.set(peticiones);
        this.loading.set(false);
      })
    );
  }


  getById(id: number) {
    return this.http.get<any>(`${this.API_URL}/${id}`).pipe(
      map(res => {
        const p = res.data ?? res;
        // Normalizamos aquí para que TODO el mundo reciba 'files'
        if (p.file) { p.files = [p.file]; }
        return p as Petition;
      })
    );
  }
  create(formData: FormData) {
    return this.http.post<{ data: Petition }>(this.API_URL, formData).pipe(
      tap(res => {
// Añadimos la nueva petición al principio de la lista local
        this.#peticiones.update(list => [res.data, ...list]);
      })
    );
  }
  update(id: number, formData: FormData) {
// Truco para que Laravel acepte archivos en actualización
    formData.append('_method', 'PUT');
    return this.http.post<{ data: Petition }>(`${this.API_URL}/${id}`, formData).pipe(
      tap(res => {
// Actualizamos solo la petición modificada en la lista local
        this.#peticiones.update(list =>
          list.map(p => p.id === id ? res.data : p)
        );
      })
    );
  }
  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      tap(() => {
// Eliminamos la petición de la lista local
        this.#peticiones.update(list => list.filter(p => p.id !== id));
      })
    );
  }
  firmar(id: number) {
    return this.http.post<{ success: boolean, message: string }>(
      `${this.API_URL}/firmar/${id}`,
      {}
    );
  }
  getCategories() {
    return this.http.get<Categoria[]>(`${this.API_URL}/categories`);
  }
}

