import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSystemOwnerComponent } from './register-system-owner.component';

describe('RegisterSystemOwnerComponent', () => {
  let component: RegisterSystemOwnerComponent;
  let fixture: ComponentFixture<RegisterSystemOwnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterSystemOwnerComponent]
    });
    fixture = TestBed.createComponent(RegisterSystemOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
