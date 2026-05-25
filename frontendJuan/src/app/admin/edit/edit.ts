import {Component, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {Categoria} from '../../models/petition';
import {AdminService} from '../../admin';
import {Sidebar} from '../sidebar/sidebar';

@Component({
  selector: 'app-edit',
  imports: [
    ReactiveFormsModule,
    Sidebar
  ],
  templateUrl: './edit.html',
  styleUrl: './edit.css',
})
export class Edit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  public admin = inject(AdminService);

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
      category: ['', [Validators.required]],
      status: ['', [Validators.required]]  // <- faltaba esto
    });
  }

  ngOnInit(): void {
    this.admin.getCategories().subscribe({
      next: (data) => {
        this.categoria = data;
      },
      error: (err) => console.error('Error al cargar categorías', err)
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.petitionId = +idParam;
      this.admin.getById(this.petitionId).subscribe({
        next: (res: any) => {
          this.editForm.patchValue({
            title: res.title,
            description: res.description,
            destinatary: res.destinatary,
            category: res.category_id,
            status: res.status,
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

    this.admin.updateAdmin(this.petitionId, fd).subscribe({
      next: (res) => {
        console.log('¡Guardado!', res);
        this.router.navigate(['/admin']);
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
