import {Component, inject, signal, OnInit} from '@angular/core';
import {NgClass, AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth/auth';
import {Router, ActivatedRoute} from '@angular/router';
import {User} from '../../models/petition';
import {AdminService} from '../../admin';

@Component({
  selector: 'app-showuser',
  imports: [NgClass, AsyncPipe],
  templateUrl: './showuser.html',
  styleUrl: './showuser.css',
})
export class Showuser implements OnInit {
  admin = inject(AdminService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  user$ !: Observable<User | null>;
  usuario = signal<User | null>(null);

  constructor(private auth: AuthService) {
    this.user$ = this.auth.user$;
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.admin.getUserAdmin(+idParam).subscribe({
        next: (data: any) => {
          const raw = data.data ?? data;
          this.usuario.set(raw);
        },
        error: (err) => console.error('Error al cargar usuario:', err)
      });
    }
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción NO se puede deshacer.')) {
      this.admin.deleteUserAdmin(id).subscribe({
        next: () => {
          alert('Usuario eliminado correctamente.');
          this.router.navigate(['/admin/users']);
        },
        error: (err) => {
          console.error('Error detallado:', err);
          const errorMessage = err.error?.message || 'Ocurrió un error inesperado.';
          alert(errorMessage);
        }
      });
    }
  }

  cambiarRol(usuario: User) {
    const nuevoRol = usuario.role === 'admin' ? 'user' : 'admin';
    const accion = nuevoRol === 'admin' ? 'hacer admin' : 'quitar admin a';

    if (confirm(`¿Estás seguro de que deseas ${accion} ${usuario.name}?`)) {
      this.admin.roleUserAdmin(usuario.id).subscribe({
        next: () => {
          this.usuario.update(u => u ? { ...u, role: nuevoRol } : u);
          alert(`Rol de ${usuario.name} actualizado correctamente.`);
        },
        error: (err) => {
          console.error('Error al cambiar el rol:', err);
          alert('Ocurrió un error al cambiar el rol.');
        }
      });
    }
  }
}
