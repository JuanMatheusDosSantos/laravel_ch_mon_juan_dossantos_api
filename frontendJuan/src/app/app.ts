import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router'
import {FooterComponent} from './views/footer-component/footer-component';
import {NavbarComponent} from './views/navbar-component/navbar-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontendJuan');
}
