import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  terminoBusqueda: string = '';
  constructor(private router: Router) {}
  buscar() {
    if (this.terminoBusqueda.trim()) {
// Navegamos a /peticiones?q=termino
      this.router.navigate(['/petitions'], { queryParams: { q: this.terminoBusqueda } });
    } else {
      this.router.navigate(['/petitions']);
    }
  }
}
