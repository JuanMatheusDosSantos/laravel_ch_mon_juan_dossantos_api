import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {PetitionService} from '../../components/petition';
import {AuthService} from '../../auth/auth';
import {Petition} from '../../models/petition';

import{User} from "../../auth/auth.model";

@Component({
  selector: 'app-list-component',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list-component.html',
  styleUrl: './list-component.css',
})
export class ListComponent {
  peticionService = inject(PetitionService);
  public authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  peticiones: Petition[] = [];
  public cargando: boolean = true;
  public isLoggedIn = this.authService.isLoggedIn;


  public currentUser: User | null=null;


  ngOnInit(): void {
    this.authService.loadUserIfNeeded();
    this.authService.user$.subscribe(user => {
      this.currentUser = user ? user : null;
    });
    this.route.queryParams.subscribe(params => {
      const busqueda = params['q'];
      this.cargando = true;
      this.peticionService.fetchPeticiones().subscribe({
        next: (data) => {
          // if (busqueda) {
          //   this.peticiones = data.filter((p: any) =>
          //     p.title.toLowerCase().includes(busqueda.toLowerCase()) ||
          //     p.description.toLowerCase().includes(busqueda.toLowerCase())
          //   );
          // } else {
          //   this.peticiones = data;
          //   console.log(data)
          // }

          this.peticiones = data
          console.log(data)

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
    if (confirm('¿Seguro?')) {
      this.peticionService.delete(id).subscribe({
        error: (err) => alert('No puedes borrar esto (quizás no eres el dueño)'),
        next: () => this.peticiones = this.peticiones.filter(p => p.id !== id)
      });
    }
  }

  firmar(id: number) {
    this.peticionService.firmar(id).subscribe({
      next: () => {
        // Recargamos la lista para que se actualicen los firmantes
        this.peticionService.fetchPeticiones().subscribe(data => this.peticiones = data);
      },
      error: (err) => console.error('Error al firmar', err)
    });
  }
}
