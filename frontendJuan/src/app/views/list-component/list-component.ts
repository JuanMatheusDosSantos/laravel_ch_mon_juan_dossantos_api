import {Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {PetitionService} from '../../components/petition';
import {AuthService} from '../../auth/auth';
import {Categoria, Petition} from '../../models/petition';


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

  // peticiones: Petition[] = [];
  peticiones = signal<Petition[]>([]);

  categories: Categoria[]=[];

  searchQuery = signal('');
  categoriaSeleccionada = signal('');

  filtroFirmado = signal('');

  public cargando: boolean = true;
  public isLoggedIn = this.authService.isLoggedIn;

  public currentUser: any | null=null;


  ngOnInit(): void {
    // this.authService.initSession();
    this.authService.user$.subscribe(user => {
      this.currentUser = user ? user : null;
    });
    this.route.queryParams.subscribe(params => {
      this.cargando = true;
      this.peticionService.fetchPeticiones().subscribe({
        next: (data) => {
          this.peticiones.set(data)
          console.log(data)
          // console.log(data[0].category_count)
          this.peticionService.getCategories().subscribe({
            next:(data)=>{
              this.categories=data
              console.log(data)
            }
          })
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
        next: () => this.peticiones.update(ps=>ps.filter(p => p.id !== id))
      });
    }
  }

  firmar(id: number) {
    this.peticionService.firmar(id).subscribe({
      next: () => {
        // Recargamos la lista para que se actualicen los firmantes
        this.peticionService.fetchPeticiones().subscribe(data => this.peticiones.set(data));
      },
      error: (err) => console.error('Error al firmar', err)
    });
  }
  peticionesFiltradas=computed<Petition[]>(()=>
  this.peticiones().filter(p=>{
    const buscador=!this.searchQuery()||p.title.toLowerCase().includes(this.searchQuery().toLowerCase())
      ||p.description.toLowerCase().includes(this.searchQuery().toLowerCase())
    const categorias=!this.categoriaSeleccionada()||p.category_id?.toString()==this.categoriaSeleccionada()

    const yaFirmada = p .signers === this.currentUser?.id;

    const estaFirmado=!this.filtroFirmado()||
      (this.filtroFirmado() === 'firmada' && yaFirmada) ||
      (this.filtroFirmado() === 'no_firmada' && !yaFirmada);

    return buscador && categorias && estaFirmado;

  })
  )
}
