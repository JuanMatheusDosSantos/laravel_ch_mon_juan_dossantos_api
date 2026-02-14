import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PetitionService } from '../../components/petition'; // Verifica esta ruta
import { AuthService } from '../../auth/auth';                // Verifica esta ruta
import { Petition } from '../../models/petition';

@Component({
  selector: 'app-show-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './show-component.html',
  styleUrls: [
    './show-component.css',
    '../../../assets/css/carouselHome.css',
    '../../../assets/css/general.css'
  ]
})
export class ShowComponent implements OnInit {
  public peticionService = inject(PetitionService);
  public authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // DEFINIR COMO SIGNAL PARA QUE EL HTML NO DE ERROR
  public peticion = signal<Petition | null>(null);
  public loading = signal(true);
  public isLoggedIn = this.authService.isLoggedIn;


  // AÑADE ESTA LÍNEA

  public currentUserId = this.authService.currentUser;
  ngOnInit(): void {
    this.authService.loadUserIfNeeded();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    // 2. Cargamos la petición
    if (id) {
      this.peticionService.getById(id).subscribe({
        next: (data) => {
          this.peticion.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error:', err);
          this.loading.set(false);
        }
      });
    }
  }

  getImagenUrl(): string {
    const pet = this.peticion();
    console.log('Datos de la petición en imagen:', pet); // <--- AÑADE ESTO

    if (pet && pet.files && pet.files.length > 0) {
      const finalUrl = `http://localhost:8000/storage/assets/img/petitions/${pet.files[0].file_path.replace('storage/', '')}`;
      console.log('URL Generada:', finalUrl); // <--- Y ESTO
      return finalUrl;
    }
    return 'assets/no-image.png';
  }

  delete() {
    const pet = this.peticion();
    if (pet && confirm('¿Estás seguro?')) {
      this.peticionService.delete(pet.id).subscribe(() => {
        this.router.navigate(['/petitions']);
      });
    }
  }
}
