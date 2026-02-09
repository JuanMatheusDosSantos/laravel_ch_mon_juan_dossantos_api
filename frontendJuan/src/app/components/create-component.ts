import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {PetitionService} from './petition';
@Component({
  selector: 'app-create-component',
  standalone:true,
  imports: [ReactiveFormsModule],
  templateUrl: '../views/create-component/create-component.html',
  styleUrl: '../views/create-component/create-component.css',
})
export class CreateComponent {
  private fb = inject(FormBuilder);
  private peticionService = inject(PetitionService);
  private router = inject(Router);
  loading = signal(false);
  fileToUpload: File | null = null;
  itemForm = this.fb.group({
    titulo: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    destinatario: ['', [Validators.required]],
    categoria_id: ['', [Validators.required]]
  });
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.fileToUpload = file;
  }
  onSubmit() {
    if (this.itemForm.valid && this.fileToUpload) {
      this.loading.set(true);
      const formData = new FormData();
      formData.append('titulo', this.itemForm.value.titulo!);
      formData.append('descripcion', this.itemForm.value.descripcion!);
      formData.append('destinatario', this.itemForm.value.destinatario!);
      formData.append('categoria_id', this.itemForm.value.categoria_id!);
      formData.append('file', this.fileToUpload);
      this.peticionService.create(formData).subscribe({
        next: () => this.router.navigate(['/petitions']),
        error: (err) => this.loading.set(false)
      });
    } else {
      alert('Rellena todos los campos e imagen');
    }
  }
}
