// import { Component } from '@angular/core';
// import { RouterLink, Router } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [RouterLink, FormsModule],
//   templateUrl: './home.html',
//   styleUrls: ['./home.css']
// })
// export class HomeComponent {
//   terminoBusqueda: string = '';
//   constructor(private router: Router) {}
//   buscar() {
//     if (this.terminoBusqueda.trim()) {
// // Navegamos a /peticiones?q=termino
//       this.router.navigate(['/petitions'], { queryParams: { q: this.terminoBusqueda } });
//     } else {
//       this.router.navigate(['/petitions']);
//     }
//   }
// }
import { Component, inject } from '@angular/core'; // Añadimos inject
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {AuthService} from '../auth/auth';
import {CommonModule} from '@angular/common'; // <--- IMPORTA TU SERVICIO AQUÍ
declare var bootstrap: any;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule,CommonModule],
  templateUrl: './home.html',
  styleUrls: [
    './home.css',
    '../../assets/css/carouselHome.css',
    '../../assets/css/general.css'
  ]
})



export class HomeComponent {

  terminoBusqueda: string = '';

  private authServices = inject(AuthService);
  public isLoggedIn = this.authServices.isLoggedIn;
  public currentUser = this.authServices.currentUser;
  // Inyectamos el servicio para que el HTML pueda usarlo
  // Usamos 'public' para que sea visible en el template (.html)
  constructor(private router: Router, public authService: AuthService) {

  }
  ngOnInit(){
    this.authService.loadUserIfNeeded();
  }


  buscar() {
    if (this.terminoBusqueda.trim()) {
      this.router.navigate(['/petitions'], { queryParams: { q: this.terminoBusqueda } });
    } else {
      this.router.navigate(['/petitions']);
    }
  }
}
