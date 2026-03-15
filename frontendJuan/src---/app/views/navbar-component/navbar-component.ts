import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../auth/auth';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar-component.html',
  styleUrl: './navbar-component.css'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  public router: Router = inject(Router);

// REFERENCIA A SIGNALS:
// No las ejecutamos con (), pasamos la referencia para que el template las "escuche"
  public currentUser = this.authService.currentUser;
  public isLoggedIn = this.authService.isLoggedIn;
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        // Solo navegamos CUANDO el servidor responda que el logout fue OK
        this.router.navigate(['/']);
      },
      error: (err) => {
        // Si el servidor da error, navegamos de todos modos para que el usuario no se quede bloqueado
        console.error('Error en logout', err);
        this.router.navigate(['/']);
      }
    });
  }
}
