import { TestBed } from '@angular/core/testing';

import { EditComponent } from './edit-component';

describe('EditComponent', () => {
  let service: EditComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
