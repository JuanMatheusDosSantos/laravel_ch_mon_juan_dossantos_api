import { TestBed } from '@angular/core/testing';

import { ShowComponent } from './show-component';

describe('ShowComponent', () => {
  let service: ShowComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
