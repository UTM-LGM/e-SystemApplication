import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedApplicationListComponent } from './approved-application-list.component';

describe('ApprovedApplicationListComponent', () => {
  let component: ApprovedApplicationListComponent;
  let fixture: ComponentFixture<ApprovedApplicationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovedApplicationListComponent]
    });
    fixture = TestBed.createComponent(ApprovedApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
