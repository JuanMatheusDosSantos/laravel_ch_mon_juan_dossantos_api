import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth'; // Verifica que esta ruta sea correcta

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: '../pages/login/login.html',
  styleUrl: '../pages/login/login.css',
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  errorMessage = '';
  // Esta es la propiedad que el error dice que falta:
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Asegúrate de que en el HTML diga (ngSubmit)="onSubmit()" o cambia esto a login()
  onSubmit() {
    if (this.loginForm.invalid) return;

    this.errorMessage = '';
    this.auth.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/petitions']);
      },
      error: (err) => {
        this.errorMessage = 'Credenciales incorrectas';
        console.error(err);
      }
    });
  }
}
