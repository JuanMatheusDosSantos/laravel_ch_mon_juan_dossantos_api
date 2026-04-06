import {Component, inject, signal} from '@angular/core';
import {PetitionService} from '../../components/petition';
import {AuthService} from '../../auth/auth';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Petition} from '../../models/petition';

@Component({
  selector: 'app-show',
  imports: [
    RouterLink
  ],
  templateUrl: './adminshow.html',
  styleUrl: './adminshow.css',
})
export class AdminShow {


  public peticionService = inject(PetitionService);
  public authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // DEFINIR COMO SIGNAL PARA QUE EL HTML NO DE ERROR
  public peticion = signal<Petition | null>(null);
  public loading = signal(true);
  public isLoggedIn = this.authService.isLoggedIn;

  public currentUser: any | null = null;

  // AÑADE ESTA LÍNEA

  ngOnInit(): void {
    // this.authService.initSession();

    this.authService.user$.subscribe(user => {
      this.currentUser = user ? user : null;
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    // 2. Cargamos la petición
    if (id) {
      this.peticionService.getById(id).subscribe({
        next: (data) => {
          this.peticion.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error:', err);
          this.loading.set(false);
        }
      });
    }
  }

  getImagenUrl(): string | [] {
    let file;
    const pet = this.peticion();

    console.log("este es el pet signers",pet?.signers)
    let finalUrl: [] | any = []
    if (pet && pet.files && pet.files.length > 0) {
      for (file of pet.files) {
        finalUrl = [...finalUrl, `http://localhost:8000/storage/assets/img/petitions/${file.file_path.replace('storage/', '')}`];
      }
      return finalUrl;
    }
    return 'assets/no-image.png';
  }

  delete() {
    const pet = this.peticion();
    if (pet && confirm('¿Estás seguro?')) {
      this.peticionService.delete(pet.id).subscribe(() => {
        this.router.navigate(['/petitions']);
      });
    }
  }

  get isSigned() {
    const pet = this.peticion()
    return pet?.signers?.some((s: any) => s.id === this.currentUser.id)
  }

  recargar() {
    window.location.reload()
  }

  firmar(id: number) {
    this.peticionService.firmar(id).subscribe(
      {
        next: () => window.location.reload()
      })
  }

  desFirmar(id: number) {
    this.peticionService.desFirmar(id).subscribe(
      {
        next: () => window.location.reload()
      })
  }

}
