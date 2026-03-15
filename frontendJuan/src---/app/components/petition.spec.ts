import { TestBed } from '@angular/core/testing';
import {Petition} from '../models/petition';
import {PetitionService} from './petition';



describe('PetitionService', () => {
  let service: PetitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PetitionService,
        // En Angular moderno (Standalone), usamos provideHttpClient para los tests
      ]
    });
    // Aquí inyectamos la CLASE del servicio, no la interface
    service = TestBed.inject(PetitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
