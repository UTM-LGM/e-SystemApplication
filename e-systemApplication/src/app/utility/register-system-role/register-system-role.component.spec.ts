import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSystemRoleComponent } from './register-system-role.component';

describe('RegisterSystemRoleComponent', () => {
  let component: RegisterSystemRoleComponent;
  let fixture: ComponentFixture<RegisterSystemRoleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterSystemRoleComponent]
    });
    fixture = TestBed.createComponent(RegisterSystemRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
