import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Signedpetitions } from './signedpetitions';

describe('Signedpetitions', () => {
  let component: Signedpetitions;
  let fixture: ComponentFixture<Signedpetitions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signedpetitions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Signedpetitions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
