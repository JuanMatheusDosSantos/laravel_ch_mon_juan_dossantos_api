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
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  public peticionService = inject(PetitionService);

  editForm!: FormGroup;
  petitionId!: number;
  errorMessage: string = '';
  loading: boolean = false;
  public categoria: Categoria[] = [];
  files:File[]=[]

  constructor() {
    this.editForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      destinatary: ['', [Validators.required]],
      category: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.peticionService.getCategories().subscribe({
      next: (data) => {
        this.categoria = data;
      },
      error: (err) => console.error('Error al cargar categorías', err)
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.petitionId = +idParam;
      this.peticionService.getById(this.petitionId).subscribe({
        next: (res: any) => {
          this.editForm.patchValue({
            title: res.title,
            description: res.description,
            destinatary: res.destinatary,
            category: res.category_id,
            status: 'pending',
          });
        }
      });
    }
  }
  onFileChange(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.files=Array.from(event.target.files)
    }
  }

  onSubmit(): void {
    if (this.editForm.invalid) return;

    this.loading = true;
    const fd = new FormData();

    fd.append('title', this.editForm.value.title);
    fd.append('description', this.editForm.value.description);
    fd.append('destinatary', this.editForm.value.destinatary);

    fd.append('category', this.editForm.value.category);

    fd.append('status', this.editForm.value.status || 'pending');
    fd.append('signers', '0');

    if (this.files){
      for (let i=0; i<this.files.length;i++){
        fd.append("files[]",this.files[i])
      }
    }

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
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}
