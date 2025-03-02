import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobseekerManagementComponent } from './jobseeker-management.component';

describe('JobseekerManagementComponent', () => {
  let component: JobseekerManagementComponent;
  let fixture: ComponentFixture<JobseekerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobseekerManagementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobseekerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
