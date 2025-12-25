import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { APIResponse } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm!: FormGroup;
  private subscription!: Subscription;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const email = this.forgotPasswordForm.value.email;
    this.successMessage = '';
    this.errorMessage = '';

    this.subscription = this.authService.forgotPassword(email).subscribe({
      next: (response: APIResponse) => {
        if (response) {
          this.successMessage = 'Password reset link sent to your email!';
          this.errorMessage = ''; // Clear any previous error messages
        } else {
          this.errorMessage = 'Something went wrong! Please try again.';
          this.successMessage = ''; // Clear success message in case of failure
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'An error occurred. Please try again.';
        this.successMessage = ''; // Clear success message in case of error
      },
    });
  }


  get f() {
    return this.forgotPasswordForm.controls;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
