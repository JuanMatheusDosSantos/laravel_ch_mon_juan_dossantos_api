import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // Eliminamos ActivatedRoute
import { PetitionService } from '../../components/petition';
import { Categoria } from '../../models/petition';

@Component({
  selector: 'app-create', // Cambiado a create
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-component.html' // Asegúrate de que el nombre coincida con tu archivo
})
export class CreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  public router = inject(Router);
  public peticionService = inject(PetitionService);

  // Usamos 'createForm' para que coincida con el [formGroup] del HTML
  createForm!: FormGroup;
  selectedFile: File | null = null;
  errorMessage: string = '';
  loading: boolean = false;
  public categoria: Categoria[] = [];

  constructor() {
    this.createForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: ['', [Validators.required]],
      destinatary: ['', [Validators.required]],
      category_id: ['', [Validators.required]] // Coincide con el formControlName del HTML
    });
  }

  ngOnInit(): void {
    // Solo necesitamos cargar las categorías para llenar el <select>
    this.peticionService.getCategories().subscribe({
      next: (data) => {
        this.categoria = data;
      },
      error: (err) => console.error('Error al cargar categorías', err)
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.createForm.invalid) return;

    this.loading = true;
    const fd = new FormData();
    const values = this.createForm.value;

    // Mapeo de campos según lo que espera tu Validator en Laravel
    fd.append('title', values.title);
    fd.append('description', values.description);
    fd.append('destinatary', values.destinatary);

    // IMPORTANTE: Enviamos 'category' (como pide el back) usando el valor de 'category_id'
    fd.append('category', values.category_id);

    // Campos obligatorios para la creación según tu lógica de Laravel
    fd.append('status', 'pending');
    fd.append('signers', '0');

    if (this.selectedFile) {
      fd.append('image', this.selectedFile);
    }

    // Llamamos al método create (POST) del servicio
    this.peticionService.create(fd).subscribe({
      next: (res) => {
        console.log('¡Petición creada con éxito!', res);
        this.router.navigate(['/petitions']);
      },
      error: (err) => {
        this.loading = false;
        // Mostramos el mensaje de error en la UI
        this.errorMessage = err.error?.message || 'Error al crear la petición. Revisa los datos.';
        console.error('Error de Laravel:', err.error);
      }
    });
  }
}
