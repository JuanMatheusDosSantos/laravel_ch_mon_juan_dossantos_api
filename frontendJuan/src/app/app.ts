import {Component, inject, signal} from '@angular/core';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router'
import {FooterComponent} from './views/footer-component/footer-component';
import {NavbarComponent} from './views/navbar-component/navbar-component';
import {AuthService} from './auth/auth';
import {Sidebar} from './admin/sidebar/sidebar';
import {AdminNavbar} from './admin/admin-navbar/admin-navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, Sidebar, AdminNavbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  esAdmin = signal(false);
  protected readonly title = signal('frontendJuan');

  protected auth = inject(AuthService);

  ngOnInit() {
    this.auth.initSession();
  }

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.esAdmin.set(event.url.startsWith('/admin'));
      }
    });
  }
}
