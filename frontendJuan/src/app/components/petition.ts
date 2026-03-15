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
    // return this.http.get<any>(this.API_URL).pipe(
    //   map(res => {
    //     const rawData = res.data ?? res;
    //     const data = Array.isArray(rawData) ? rawData : [];
    //
    //     return data.map((p: any) => {
    //       return {
    //         ...p,
    //         files: p.files && p.files.length > 0
    //           ? p.files
    //           : (p.file ? [p.file] : [])
    //       };
    //     });
    //   }),
    //   tap(peticiones => {
    //     this.#peticiones.set(peticiones);
    //     this.loading.set(false);
    //   })
    // );

    return this.http.get<any>(this.API_URL).pipe(
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
  create(formData: FormData) {
    // return this.http.post<{ data: Petition }>(this.API_URL, formData).pipe(
    return this.http.post<{ data: Petition }>(`${this.API_URL}/petition`, formData).pipe(
      tap(res => {
// Añadimos la nueva petición al principio de la lista local
        this.#peticiones.update(list => [res.data, ...list]);
      })
    );
  }
  update(id: number, formData: FormData) {
    formData.append('_method', 'PUT');
    return this.http.post<{ data: Petition }>(`${this.API_URL}/${id}`, formData).pipe(
      tap(res => {
        this.#peticiones.update(list =>
          list.map(p => p.id === id ? res.data : p)
        );
      })
    );
  }
  delete(id: number) {
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      tap(() => {
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

  desFirmar(id:number){
    return this.http.post<{ success: boolean, message: string }>(
      `${this.API_URL}/desfirmar/${id}`,
      {}
    );
  }

}

