import {Component, inject} from '@angular/core';
import {AdminService} from '../../admin';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-editouser',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './editouser.html',
  styleUrl: './editouser.css',
})
export class Editouser {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private admin = inject(AdminService);

  editForm!: FormGroup;
  userId!: number;
  errorMessage: string = '';
  loading: boolean = false;

  constructor() {
    this.editForm = this.fb.group({
      name:     ['', [Validators.required]],
      email:    ['', [Validators.required, Validators.email]],
      role:     ['', [Validators.required]],
      password: ['']
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = +idParam;
      this.admin.getUserAdmin(this.userId).subscribe({
        next: (data: any) => {
          const raw = data.data ?? data;
          this.editForm.patchValue({
            name:  raw.name,
            email: raw.email,
            role:  raw.role
          });
        },
        error: (err) => console.error('Error al cargar usuario:', err)
      });
    }
  }

  // onSubmit(): void {
  //   if (this.editForm.invalid) return;
  //
  //   this.loading = true;
  //   const fd = new FormData();
  //
  //   fd.append('name',  this.editForm.value.name);
  //   fd.append('email', this.editForm.value.email);
  //   fd.append('role',  this.editForm.value.role);
  //
  //   if (this.editForm.value.password) {
  //     fd.append('password', this.editForm.value.password);
  //   }
  //
  //   this.admin.updateUserAdmin(this.userId, fd).subscribe({
  //     next: () => {
  //       alert('Usuario actualizado correctamente.');
  //       this.router.navigate(['/admin/users']);
  //     },
  //     error: (err) => {
  //       this.loading = false;
  //       this.errorMessage = err.error?.message || 'Ocurrió un error al guardar los cambios.';
  //       console.error('Error al actualizar usuario:', err);
  //     }
  //   });
  // }

  onSubmit(): void {
    if (this.editForm.invalid) return;

    this.loading = true;
    const body: any = {
      name:  this.editForm.value.name,
      email: this.editForm.value.email,
      role:  this.editForm.value.role,
    };

    if (this.editForm.value.password) {
      body.password = this.editForm.value.password;
    }

    this.admin.updateUserAdmin(this.userId, body).subscribe({
      next: () => {
        alert('Usuario actualizado correctamente.');
        this.router.navigate(['/admin/users']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Ocurrió un error al guardar los cambios.';
        console.error('Error al actualizar usuario:', err);
      }
    });
  }

}
