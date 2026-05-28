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

  categories = signal<Categoria[]>([]);

  searchQuery = signal('');
  categoriaSeleccionada = signal('');

  filtroFirmado = signal('');

  public cargando: boolean = true;
  public isLoggedIn = this.authService.isLoggedIn;

  public currentUser: any | null=null;

  paginaActual = signal(1);
  peticionesPorPagina  = signal(4);

  ngOnInit(): void {
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
              this.categories.set(data)
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
  peticionesFiltradas = computed<Petition[]>(() => {
    const f = this.filtroFirmado();
    return this.categoria().filter(p => {
      if (f === 'firmada') return this.isSigned(p);
      if (f === 'no_firmada') return !this.isSigned(p);
      return true;
    });
  });

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
    if (tipo === 'search') {
      this.searchQuery.set(valor);
      this.categoriaSeleccionada.set('');
      this.filtroFirmado.set('');
    }
    if (tipo === 'categoria') this.categoriaSeleccionada.set(valor);
    if (tipo === 'firmado') this.filtroFirmado.set(valor);
    this.paginaActual.set(1);
  }

  desFirmar(id: number) {
    this.peticionService.desFirmar(id).subscribe(
      {
        next: () => window.location.reload()
      })
  }

  isSigned(petition: Petition): boolean {
    return petition?.signers > 0;
  }

  search = computed(() => {
    const q = this.searchQuery().toLowerCase();
    return this.peticiones().filter(p =>
      !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  });
  categoria = computed(() => {
    const cat = this.categoriaSeleccionada();
    return this.search().filter(p =>
      !cat || p.category_id?.toString() === cat
    );
  });
  categoriasDisponibles = computed(() => {
    const f = this.filtroFirmado();
    const base = this.search().filter(p => {
      if (f === 'firmada') return this.isSigned(p);
      if (f === 'no_firmada') return !this.isSigned(p);
      return true;
    });
    const ids = new Set(base.map(p => p.category_id));
    return this.categories().filter(c => ids.has(c.id));
  });


  firmadoDisponible = computed(() => {
    const pets = this.search();
    const haySigned = pets.some(p => this.isSigned(p));
    const hayUnsigned = pets.some(p => !this.isSigned(p));
    return { haySigned, hayUnsigned };
  });

}
