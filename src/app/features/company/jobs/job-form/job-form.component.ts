import { Component, Output, EventEmitter } from '@angular/core';
import { Job } from '../../../../core/models/Job.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './job-form.component.html',
  styleUrl: './job-form.component.scss'
})
export class JobFormComponent {

  @Output() jobCreated = new EventEmitter<Job>();
  @Output() cancel = new EventEmitter<void>();

  jobForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.jobForm = this.fb.group({
      jobTitle: ['', Validators.required],
      jobDescription: ['', Validators.required],
      requirements: ['', Validators.required],
      location: ['', Validators.required],
      jobType: ['', Validators.required],
      salaryRange: [''],
      status: ['Active', Validators.required],
      expiryDate: [''],
      companyName: ['', Validators.required]
    });
  }

  submit(): void {
    if (this.jobForm.invalid) return;

    const job: Job = {
      jobId: 0, // backend will generate
      ...this.jobForm.value
    };

    this.jobCreated.emit(job);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
