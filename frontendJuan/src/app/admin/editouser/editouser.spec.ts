import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editouser } from './editouser';

describe('Editouser', () => {
  let component: Editouser;
  let fixture: ComponentFixture<Editouser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editouser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editouser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
