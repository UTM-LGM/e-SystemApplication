import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSystemComponent } from './register-system.component';

describe('RegisterSystemComponent', () => {
  let component: RegisterSystemComponent;
  let fixture: ComponentFixture<RegisterSystemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterSystemComponent]
    });
    fixture = TestBed.createComponent(RegisterSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
