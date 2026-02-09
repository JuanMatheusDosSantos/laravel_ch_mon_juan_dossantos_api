import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {PetitionService} from './petition';
import {Petition} from '../models/petition';
@Component({
  selector: 'app-peticion-edit',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: '../views/edit-component/edit-component.html'
})
export class EditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private peticionService = inject(PetitionService);
  readonly API_URL = 'http://localhost:8000/storage/';
  id = signal<number | null>(null);
  loading = signal(false);
  fileToUpload: File | null = null;
  peticion: Petition | null = null;
  itemForm = this.fb.group({
    titulo: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    destinatario: ['', [Validators.required]],
    categoria_id: ['', [Validators.required]]
  });
  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id.set(Number(idParam));
      this.cargarDatos(this.id()!);
    }
  }
  cargarDatos(id: number) {
    this.peticionService.getById(id).subscribe({
      next: (res: any) => {
        const data = res.data ? res.data : res;
        this.peticion = data as Petition;
        this.itemForm.patchValue({
          titulo: data.titulo,
          descripcion: data.descripcion,
          destinatario: data.destinatario,
          categoria_id: String(data.categoria_id)
        });
      }
    });
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) this.fileToUpload = file;
  }
  onSubmit() {
    if (this.itemForm.invalid || !this.id()) return;
    this.loading.set(true);
    const formData = new FormData();
    formData.append('titulo', this.itemForm.get('titulo')?.value || '');
    formData.append('descripcion', this.itemForm.get('descripcion')?.value || '');
    formData.append('destinatario', this.itemForm.get('destinatario')?.value || '');
    formData.append('categoria_id', this.itemForm.get('categoria_id')?.value || '');
    if (this.fileToUpload) {
      formData.append('file', this.fileToUpload);
    }
    this.peticionService.update(this.id()!, formData).subscribe({
      next: () => this.router.navigate(['/peticiones']),
      error: () => this.loading.set(false)
    });
  }
  getImagenUrl(): string {
    if (this.peticion && this.peticion.files && this.peticion.files.length > 0) {
      return `${this.API_URL}${this.peticion.files[0].file_path}`;
    }
    return 'assets/no-image.png';
  }
}
