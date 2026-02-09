import { TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar-component';

describe('NavbarComponent', () => {
  let service: NavbarComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavbarComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
