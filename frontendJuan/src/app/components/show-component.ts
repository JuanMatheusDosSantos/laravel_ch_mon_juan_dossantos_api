import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import {PetitionService} from './petition';
import {AuthService} from '../auth/auth';
import {Petition} from '../models/petition';

@Component({
  selector: 'app-show-component',
  standalone: true,
  imports: [RouterLink, DatePipe, CommonModule],
  templateUrl: '../views/show-component/show-component.html',
  styleUrls: ['../views/show-component/show-component.css']
})
export class ShowComponent implements OnInit {
  public peticionService = inject(PetitionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  public authService = inject(AuthService);
  peticion = signal<Petition | null>(null);
  loading = signal(true);
  public currentUserId: number | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarPeticion(Number(id));
    }
    this.authService.user$.subscribe(user => {
      this.currentUserId = user ? user.id : null;
    });
    this.authService.loadUserIfNeeded();
  }
  cargarPeticion(id: number) {
    this.peticionService.getById(id).subscribe({
      next: (res: any) => {
        this.peticion.set(res.data ? res.data : res);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
      }
    });
  }getImagenUrl(): string {
    const pet = this.peticion();
    if (pet && pet.files && pet.files.length > 0) {
      let path = pet.files[0].file_path;

      // 1. Limpiamos cualquier rastro de 'public/' o 'storage/' que venga de la BD
      path = path.replace('public/', '').replace('storage/', '');

      // 2. Si el path no empieza por '/', se lo ponemos para que no se pegue a la base
      if (!path.startsWith('/')) {
        path = '/' + path;
      }

      // 3. Usamos la base SIN 'public'
      const baseUrl = 'http://localhost:8000/storage/assets/img/petitions';

      return `${baseUrl}${path}`;
    }

    // Si no hay nada de lo anterior, imagen por defecto
    return 'assets/no-image.png';
  }
  delete() {
    const pet = this.peticion();
    if (!pet?.id) return;
    if (confirm('¿Eliminar petición?')) {
      this.peticionService.delete(pet.id).subscribe(() => {
        this.router.navigate(['/petitions']);
      });
    }
  }
}

