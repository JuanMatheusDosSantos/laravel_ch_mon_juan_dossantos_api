import {Component, OnInit, inject, signal, computed} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PetitionService} from '../../components/petition';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Categoria, Petition} from '../../models/petition';
import {AdminService} from '../../admin'; // Ajusta tu ruta
@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './panel.html',
  styleUrls: ['./panel.css'] // o .scss
})
export class PanelComponent implements OnInit {
  public baseImageUrl: string = 'http://localhost:8000/storage/assets/img/petitions/';
  admin=inject(AdminService)
// Señal para guardar las peticiones
  peticiones = signal<any[]>([]);
  cargando = signal<boolean>(true);


  searchQuery = signal('');
  categoriaSeleccionada = signal('');

  filtroFirmado = signal('');

  categories: Categoria[] = [];

  private route = inject(ActivatedRoute);

  public currentUser: any | null=null;

  paginaActual = signal(1);
  peticionesPorPagina  = signal(20);

  ngOnInit() {
    // this.cargarPeticiones();

    this.route.queryParams.subscribe(params => {
      this.cargando.set(true);
      this.admin.fetchPeticionesAdmin().subscribe({
        next: (data) => {
          this.peticiones.set(data)
          console.log(this.peticiones)
          console.log(data)
          // console.log(data[0].category_count)
          this.admin.getCategories().subscribe({
            next: (data) => {
              this.categories = data
              console.log(data)
            }
          })
          this.cargando.set(false);
        },
        error: (err) => {
          console.error('Error al cargar peticiones:', err);
          this.cargando.set(false);
        }
      });
    });

  }


  eliminarPeticion(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta petición? Esta acción NO se puede deshacer.')) {
      this.admin.deleteAdmin(id).subscribe({
        next: () => {
          this.peticiones.update(actuales => actuales.filter(p => p.id !== id))
          alert('Petición eliminada correctamente')
        }
      });
    }
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
    //math.ceil sirve para aproximar al numero mas cercano, es decir, si tienes 5 peticiones/4 por pagina => daria 1.25, entonces se aproxima a 2
    Math.ceil(this.peticionesFiltradas().length / this.peticionesPorPagina())
  );

  //esto la signal lo que hace es recortar la lista de peticiones, de tal forma de que solo muestra las peticiones de dicha pagina, haciendo que si estas en la pagina 0, te muestre desde la peticion 0
  //y si estas en la pagina 3, te mostrara a partir del peticion, luego, devuelve las peticiones del 0 al 3, en el caso de estar en la pagina 3
  peticionesPaginadas = computed<Petition[]>(() => {
    const inicio = (this.paginaActual() - 1) * this.peticionesPorPagina();
    const fin = inicio + this.peticionesPorPagina();
    return this.peticionesFiltradas().slice(inicio, fin);
  });

  //esto crea el array de numeros de pagina, la _ es porque no me importa por donde empiece, y como no quiero que el primer numero sea 0, le sumo 1, la i es para el maximo -1
  paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1)
  );


  //esto lo que hace es que cambia le numero de la pagina, siempre y cuando sea un numero que este en el array de totalPaginas y sea, por lo menos, igual a 1
  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
    }
  }

  //esto es lo mismo que el filtro normal, solo que, añadiendo que si cambias algun filtro, vuelva a la pagina 1
  aplicarFiltro(tipo: 'search' | 'categoria' | 'firmado', valor: string) {
    if (tipo === 'search') this.searchQuery.set(valor);
    if (tipo === 'categoria') this.categoriaSeleccionada.set(valor);
    if (tipo === 'firmado') this.filtroFirmado.set(valor);
    this.paginaActual.set(1); // vuelve siempre a la página 1
  }

  cambiarEstado(peticion: Petition) {
    const nuevoEstado = peticion.status === 'accepted' ? 'deny' : 'accepted';
    const accion = nuevoEstado === 'accepted' ? 'aceptar' : 'denegar';

    if (confirm(`¿Estás seguro de que deseas ${accion} esta petición?`)) {
      this.admin.cambiarEstadoPeticion(peticion.id, nuevoEstado).subscribe({
        next: () => {
          this.peticiones.update(actuales =>
            actuales.map(p =>
              p.id === peticion.id ? { ...p, status: nuevoEstado } : p
            )
          );
          alert(`Petición ${accion === 'aceptar' ? 'aceptada' : 'denegada'} correctamente.`);
        },
        error: (err) => {
          console.error(`Error al ${accion} la petición:`, err);
          alert('Ocurrió un error al cambiar el estado. Inténtalo de nuevo.');
        }
      });
    }
  }
}
