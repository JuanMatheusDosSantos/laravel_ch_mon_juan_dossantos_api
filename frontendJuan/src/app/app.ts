import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router'
import {FooterComponent} from './views/footer-component/footer-component';
import {NavbarComponent} from './views/navbar-component/navbar-component';
import {AuthService} from './auth/auth';
import {Sidebar} from './admin/sidebar/sidebar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontendJuan');

  protected auth = inject(AuthService);

  ngOnInit() {
    this.auth.initSession();
  }
}
