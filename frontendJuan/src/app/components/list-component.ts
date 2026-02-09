import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {AuthService} from '../auth/auth';
import {PetitionService} from './petition';
import {Petition} from '../models/petition';
@Component({
  selector: 'app-list-component',
  standalone:true,
  imports: [CommonModule, RouterLink],
  templateUrl: '../views/list-component/list-component.html',
  styleUrl: '../views/list-component/list-component.css',
})
export class ListComponent {
  peticionService = inject(PetitionService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  public peticiones: Petition[] = [];
  public cargando: boolean = true;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
const busqueda = params['q'];
this.cargando = true;
this.peticionService.fetchPeticiones().subscribe({
  next: (data) => {
    if (busqueda) {
      this.peticiones = data.filter((p: any) =>
        p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase())
      );
    } else {
      this.peticiones = data;
    }
    this.cargando = false;
  },
  error: (err) => {
    console.error('Error al cargar peticiones:', err);
    this.cargando = false;
  }
});
});
}
delete(id: number) {
  if(confirm('¿Seguro?')) {
    this.peticionService.delete(id).subscribe({
      error: (err) => alert('No puedes borrar esto (quizás no eres el dueño)'),
      next: () => this.peticiones = this.peticiones.filter(p => p.id !== id)
    });
  }
}
}
