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
  private peticionService = inject(PetitionService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  peticion = signal<Petition | null>(null);
  loading = signal(true);
  public currentUserId: number | null = null;
  readonly API_STORAGE = 'http://localhost:8000/storage/';
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
  }
  getImagenUrl(): string {
    const pet = this.peticion();
    if (pet && pet.files && pet.files.length > 0) {
      const path = pet.files[0].file_path.replace('storage/', '');
      //return `${this.API_STORAGE}${cleanPath}`;
      return `${this.API_STORAGE}${path}`;
    }
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

