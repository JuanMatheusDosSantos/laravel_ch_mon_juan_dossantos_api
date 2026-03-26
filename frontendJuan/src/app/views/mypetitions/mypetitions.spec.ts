import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mypetitions } from './mypetitions';

describe('Mypetitions', () => {
  let component: Mypetitions;
  let fixture: ComponentFixture<Mypetitions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mypetitions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mypetitions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
