import { Component, inject, OnInit } from '@angular/core';
import { PetitionService } from '../../components/petition'; // Verifica que la ruta sea correcta
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth'; // Verifica que la ruta sea correcta
import { CommonModule } from '@angular/common'; // IMPORTANTE: Para que el HTML entienda @if y @for

@Component({
  selector: 'app-list-component',
  standalone: true, // Asegúrate de que sea standalone
  imports: [
    RouterLink,
    CommonModule // Añade esto para que no fallen las directivas comunes
  ],
  templateUrl: './list-component.html',
  styleUrls: [
    './list-component.css',
    '../../../assets/css/general.css',
    "../../../assets/css/carouselHome.css",
    "../../../assets/css/micss.css"
  ]
})
export class ListComponent implements OnInit {
  public peticionService = inject(PetitionService);
  public authService           =      inject(AuthService);
  ngOnInit(): void {
    this.peticionService.fetchPeticiones().subscribe();
  }

  // Corregimos el error de "delete" que pedía tu HTML
  delete(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta petición?')) {
      this.peticionService.delete(id).subscribe({
        next: () => this.peticionService.fetchPeticiones().subscribe(),
        error: (err) => console.error('Error al borrar', err)
      });
    }
  }

  firmar(id: number) {
    this.peticionService.firmar(id).subscribe({
      next: () => {
        this.peticionService.fetchPeticiones().subscribe();
      },
      error: (err) => console.error('Error al firmar', err)
    });
  }
}
