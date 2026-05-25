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

  peticiones = signal<Petition[]>([]);

  categories: Categoria[]=[];

  searchQuery = signal('');
  categoriaSeleccionada = signal('');

  filtroFirmado = signal('');

  public cargando: boolean = true;
  public isLoggedIn = this.authService.isLoggedIn;

  public currentUser: any | null=null;

  paginaActual = signal(1);
  peticionesPorPagina  = signal(4);

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

  totalPaginas = computed(() =>
    Math.ceil(this.peticionesFiltradas().length / this.peticionesPorPagina())
  );


  peticionesPaginadas = computed<Petition[]>(() => {
    const inicio = (this.paginaActual() - 1) * this.peticionesPorPagina();
    const fin = inicio + this.peticionesPorPagina();
    return this.peticionesFiltradas().slice(inicio, fin);
  });

  paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1)
  );


  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
    }
  }

  aplicarFiltro(tipo: 'search' | 'categoria' | 'firmado', valor: string) {
    if (tipo === 'search') this.searchQuery.set(valor);
    if (tipo === 'categoria') this.categoriaSeleccionada.set(valor);
    if (tipo === 'firmado') this.filtroFirmado.set(valor);
    this.paginaActual.set(1); // vuelve siempre a la página 1
  }

  desFirmar(id: number) {
    this.peticionService.desFirmar(id).subscribe(
      {
        next: () => window.location.reload()
      })
  }
}
