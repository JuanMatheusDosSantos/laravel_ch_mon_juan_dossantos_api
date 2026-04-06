import {Component, computed, inject, signal} from '@angular/core';
import {AdminService} from '../../admin';
import {User} from '../../models/petition';
import {NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [
    NgClass,
    RouterLink
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  admin = inject(AdminService);

  usuarios = signal<User[]>([]);
  cargando = signal<boolean>(true);

  searchQuery = signal('');

  paginaActual = signal(1);
  usuariosPorPagina = signal(20);

  ngOnInit() {
    this.cargando.set(true);
    this.admin.getUsersAdmin().subscribe({
      next: (data: any) => {
        const rawData = data.data ?? data;
        this.usuarios.set(Array.isArray(rawData) ? rawData : []);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.cargando.set(false);
      }
    });
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción NO se puede deshacer.')) {
      this.admin.deleteUserAdmin(id).subscribe({
        next: () => {
          this.usuarios.update(actuales => actuales.filter(u => u.id !== id));
          alert('Usuario eliminado correctamente.');
        },
        error: (err) => {
          // console.error('Error al eliminar usuario:', err);
          // alert('Ocurrió un error al eliminar el usuario.');
          console.error('Error detallado:', err);

          const errorMessage = err.error?.message || 'Ocurrió un error inesperado.';

          if (err.status === 405) {
            alert('Error interno: El método de envío no es correcto (PUT esperado).');
          } else {
            alert(`${errorMessage}`);
          }
        }
      });
    }
  }

  cambiarRol(usuario: User) {
    const nuevoRol = usuario.role === 'admin' ? 'user' : 'admin';
    const accion = nuevoRol === 'admin' ? 'hacer admin' : 'quitar admin a';

    if (confirm(`¿Estás seguro de que deseas ${accion} ${usuario.name}?`)) {
      const fd = new FormData();
      fd.append('role', nuevoRol);

      this.admin.roleUserAdmin(usuario.id).subscribe({
        next: () => {
          this.usuarios.update(actuales =>
            actuales.map(u =>
              u.id === usuario.id ? { ...u, role: nuevoRol } : u
            )
          );
          alert(`Rol de ${usuario.name} actualizado correctamente.`);
        },
        error: (err) => {
          console.error('Error al cambiar el rol:', err);
          alert('Ocurrió un error al cambiar el rol.');
        }
      });
    }
  }

  usuariosFiltrados = computed<User[]>(() =>
    this.usuarios().filter(u =>
      !this.searchQuery() ||
      u.name.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
      u.email?.toLowerCase().includes(this.searchQuery().toLowerCase())
    )
  );

  totalPaginas = computed(() =>
    Math.ceil(this.usuariosFiltrados().length / this.usuariosPorPagina())
  );

  usuariosPaginados = computed<User[]>(() => {
    const inicio = (this.paginaActual() - 1) * this.usuariosPorPagina();
    const fin = inicio + this.usuariosPorPagina();
    return this.usuariosFiltrados().slice(inicio, fin);
  });

  paginas = computed(() =>
    Array.from({ length: this.totalPaginas() }, (_, i) => i + 1)
  );

  irAPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
    }
  }

  aplicarFiltro(valor: string) {
    this.searchQuery.set(valor);
    this.paginaActual.set(1);
  }
}
