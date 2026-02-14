import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms'; // Asegúrate de que ReactiveFormsModule esté aquí
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth';
import { PetitionService } from '../../components/petition';

@Component({
  selector: 'app-login',
  standalone: true,
  // IMPORTANTE: ReactiveFormsModule debe estar en este array
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private petitionService = inject(PetitionService);
  private fb = inject(FormBuilder);

  errorMessage = '';
  loginForm!: FormGroup;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  // Cambiamos el nombre a 'login' para que coincida con tu lógica anterior
  // o cambia el HTML a 'onSubmit()'
  login() {
    if (this.loginForm.invalid) return;

    this.errorMessage = ''; // Limpiar error al intentar
    const credentials = this.loginForm.value;

    this.auth.login(credentials).subscribe({
      next: () => {
        this.router.navigate(['/petitions']).then(() => {
          this.petitionService.fetchPeticiones().subscribe();
        });
      },
      error: (err) => {
        this.errorMessage = 'Credenciales incorrectas o error de conexión';
        console.error(err);
      }
    });
  }
}
