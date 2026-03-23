import {Component, OnInit, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PetitionService} from '../../components/petition';
import {ActivatedRoute} from '@angular/router';
import {Categoria} from '../../models/petition'; // Ajusta tu ruta
@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './panel.html',
  styleUrls: ['./panel.css'] // o .scss
})
export class PanelComponent implements OnInit {
  peticionService = inject(PetitionService);
// Señal para guardar las peticiones
  peticiones = signal<any[]>([]);
  cargando = signal<boolean>(true);


  categories: Categoria[] = [];

  private route = inject(ActivatedRoute);

  ngOnInit() {
    // this.cargarPeticiones();

    this.route.queryParams.subscribe(params => {
      this.cargando.set(true);
      this.peticionService.getPeticionesAdmin().subscribe({
        next: (data) => {
          this.peticiones.set(data)
          console.log(this.peticiones)
          console.log(data)
          // console.log(data[0].category_count)
          this.peticionService.getCategories().subscribe({
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

//   cargarPeticiones() {
//     this.cargando.set(true);
//     this.peticionService.getPeticionesAdmin().subscribe({
//       next: (res) => {
// // Asumiendo que Laravel devuelve { success: true, data: [...] }
//         this.peticiones.set(res.data || res)
//         this.cargando.set(false);
//       },
//       error: (err) => {
//         console.error('Error cargando el panel', err);
//         this.cargando.set(false);
//       }
//     });
//   }

  eliminarPeticion(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta petición? Esta acción NO se puede deshacer.')) {
      this.peticionService.deletePeticionAdmin(id).subscribe({
        next: () => {
          this.peticiones.update(actuales => actuales.filter(p => p.id !== id))
          alert('Petición eliminada correctamente')
        }
      });
    }
  }

//   eliminarPeticion(id: number) {
//     if (confirm('¿Estás seguro de que deseas eliminar esta petición? Esta acción NO se puede deshacer.')) {
//     this.peticionService.deletePeticionAdmin(id).subscribe({
//       next: () => {
// // Filtramos la señal para quitar la petición eliminada de la vista al instante
//         this.peticiones.update(actuales => actuales.filter(p => p.id !== id));
//         alert('Petición eliminada correctamente');
//       },
//       error: (err) => {
//         console.error('Error al eliminar', err);
//         alert('Hubo un error al eliminar la petición');
//       }
//     });
//   }
// }
}
