import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRequestApplicationComponent } from './new-request-application.component';

describe('NewRequestApplicationComponent', () => {
  let component: NewRequestApplicationComponent;
  let fixture: ComponentFixture<NewRequestApplicationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewRequestApplicationComponent]
    });
    fixture = TestBed.createComponent(NewRequestApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
