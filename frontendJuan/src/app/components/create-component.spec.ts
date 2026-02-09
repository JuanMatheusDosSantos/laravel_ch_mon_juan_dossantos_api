import { TestBed } from '@angular/core/testing';

import { CreateComponent } from './create-component';

describe('CreateComponent', () => {
  let service: CreateComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
