import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {PetitionService} from '../../components/petition';
import {AuthService} from '../../auth/auth';
import {Petition} from '../../models/petition';


@Component({
  selector: 'app-list-component',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './list-component.html',
  styleUrls: [
    './list-component.css',
    '../../../assets/css/carouselHome.css',
    '../../../assets/css/general.css'
  ],
})
export class ListComponent {
  peticionService = inject(PetitionService);
  public authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  public baseImageUrl: string = 'http://localhost:8000/storage/assets/img/petitions/';

  peticiones: Petition[] = [];
  public cargando: boolean = true;
  public isLoggedIn = this.authService.isLoggedIn;


  public currentUser: any | null=null;


  ngOnInit(): void {
    this.authService.loadUserIfNeeded();
    this.authService.user$.subscribe(user => {
      this.currentUser = user ? user : null;
    });
    this.route.queryParams.subscribe(params => {
      this.cargando = true;
      this.peticionService.fetchPeticiones().subscribe({
        next: (data) => {
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
