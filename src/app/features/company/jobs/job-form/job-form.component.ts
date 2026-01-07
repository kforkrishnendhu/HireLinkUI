import { Component, Output, EventEmitter } from '@angular/core';
import { Job } from '../../../../core/models/Job.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.scss'
})
export class JobFormComponent {

  @Output() jobCreated = new EventEmitter<Job>();
  @Output() cancelEvent = new EventEmitter<void>();

  jobForm: FormGroup;

  constructor(private fb: FormBuilder, private authService:AuthService) {
    this.jobForm = this.fb.group({
      jobTitle: ['', Validators.required],
      jobDescription: ['', Validators.required],
      requirements: ['', Validators.required],
      location: ['', Validators.required],
      jobType: ['', Validators.required],
      salaryRange: [''],
      status: ['Active', Validators.required],
      expiryDate: ['']
    });
  }

  submit(): void {
    if (this.jobForm.invalid)
    {
      this.jobForm.markAllAsTouched();
      return;
    } 
    const cid = this.authService.getUserId();
    const job: Job = {
      jobId: 0, 
      companyId: cid,
      ...this.jobForm.value
    };

    this.jobCreated.emit(job);
  }

  onCancel(): void {
    this.cancelEvent.emit();
  }
}
