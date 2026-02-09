import { TestBed } from '@angular/core/testing';

import { ListComponent } from './list-component';

describe('ListComponent', () => {
  let service: ListComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
