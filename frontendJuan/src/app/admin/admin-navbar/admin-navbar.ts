import {Component, inject} from '@angular/core';
import {AuthService} from '../../auth/auth';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-navbar',
  imports: [],
  templateUrl: './admin-navbar.html',
  styleUrl: './admin-navbar.css',
})
export class AdminNavbar {
  public router: Router = inject(Router);

  private auth = inject(AuthService);

  logout() {
      this.auth.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
