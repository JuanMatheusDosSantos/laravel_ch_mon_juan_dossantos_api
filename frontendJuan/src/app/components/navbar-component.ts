import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {AuthService} from '../auth/auth';
@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: '../views/navbar-component/navbar-component.html',
  styleUrl: '../views/navbar-component/navbar-component.css'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  public router: Router = inject(Router);
// REFERENCIA A SIGNALS:
// No las ejecutamos con (), pasamos la referencia para que el template las "escuche"
  public currentUser = this.authService.currentUser;
  public isLoggedIn = this.authService.isLoggedIn;
  logout() {
    this.authService.logout().subscribe();
  }
}
