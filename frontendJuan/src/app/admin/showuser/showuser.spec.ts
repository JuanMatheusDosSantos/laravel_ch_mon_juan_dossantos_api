import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Showuser } from './showuser';

describe('Showuser', () => {
  let component: Showuser;
  let fixture: ComponentFixture<Showuser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Showuser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Showuser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
