import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {PetitionService} from '../../components/petition';
import {Categoria} from '../../models/petition';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-component.html'
})
export class EditComponent implements OnInit {
  // 1. INYECCIONES (Esto quita los errores de 'petitionService' y 'router')
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  public peticionService = inject(PetitionService);

  // 2. PROPIEDADES DE LA CLASE (Esto quita los errores de 'petitionId', 'errorMessage', etc.)
  editForm!: FormGroup;
  petitionId!: number;
  selectedFile: File | null = null;
  errorMessage: string = '';
  loading: boolean = false;
  public categoria: Categoria[] = [];

  constructor() {
    // Inicializamos el formulario
    this.editForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      destinatary: ['', [Validators.required]],
      category: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // 1. Cargamos las categorías para el select
    this.peticionService.getCategories().subscribe({
      next: (data) => {
        this.categoria = data;
      },
      error: (err) => console.error('Error al cargar categorías', err)
    });

    // 2. Cargamos la petición
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.petitionId = +idParam;
      this.peticionService.getById(this.petitionId).subscribe({
        next: (res: any) => {
          // IMPORTANTE: Laravel espera 'category', pero tu form usa 'category'
          // Mapeamos el valor para que el select reconozca la opción activa
          this.editForm.patchValue({
            title: res.title,
            description: res.description,
            destinatary: res.destinatary,
            category: res.category,
            status: 'pending',
          });
        }
      });
    }
  }
  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (this.editForm.invalid) return;

    this.loading = true;
    const fd = new FormData();

    // Los nombres deben ser EXACTAMENTE los que pusiste en el validate de PHP
    fd.append('title', this.editForm.value.title);
    fd.append('description', this.editForm.value.description);
    fd.append('destinatary', this.editForm.value.destinatary);

    // Aquí está el truco: enviamos 'category' porque así lo pide tu validator
    fd.append('category', this.editForm.value.category);

    // Estos campos son REQUIRED en tu Laravel:
    fd.append('status', this.editForm.value.status || 'pending');
    fd.append('signers', '0'); // O el valor que tenga la petición

    if (this.selectedFile) {
      fd.append('image', this.selectedFile);
    }

    // El servicio ya añade el _method: PUT, así que llamamos:
    this.peticionService.update(this.petitionId, fd).subscribe({
      next: (res) => {
        console.log('¡Guardado!', res);
        this.router.navigate(['/petitions']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error de validación en Laravel:', err.error);
      }
    });
  }
}
