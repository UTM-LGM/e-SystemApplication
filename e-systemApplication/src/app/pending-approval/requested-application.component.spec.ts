import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestedApplicationComponent } from './requested-application.component';

describe('RequestedApplicationComponent', () => {
  let component: RequestedApplicationComponent;
  let fixture: ComponentFixture<RequestedApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestedApplicationComponent]
    });
    fixture = TestBed.createComponent(RequestedApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
