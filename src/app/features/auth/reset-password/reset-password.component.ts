import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { PasswordValidatorDirective } from '../../../validators/password-validator.directive';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [PasswordValidatorDirective,ReactiveFormsModule,CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  resetForm!: FormGroup;
  token: string | null = null;
  isTokenValid = false;
  errorMessage = '';
  private subscriptions: Subscription = new Subscription(); // Store all subscriptions

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Extract token from the URL
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (this.token) {
      const verifySub = this.authService.verifyResetToken(this.token).subscribe({
        next: (response: boolean) => {
          if (response) {
            this.isTokenValid = true;
            this.errorMessage = ''; // Clear any previous error message
          } else {
            this.isTokenValid = false;
            this.errorMessage = 'Invalid or expired reset link.';
          }
        },
        error: () => {
          this.isTokenValid = false;
          this.errorMessage = 'An error occurred. Please try again.';
        },
      });
      
      this.subscriptions.add(verifySub);
    }

    // Initialize Form
    this.resetForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validators: [this.mustMatch('password', 'confirmPassword')] // Apply custom validator
      }
    );
  }

  mustMatch(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passControl = formGroup.controls[password];
      const confirmPassControl = formGroup.controls[confirmPassword];

      if (confirmPassControl.errors && !confirmPassControl.errors['mustMatch']) {
        return;
      }

      if (passControl.value !== confirmPassControl.value) {
        confirmPassControl.setErrors({ mustMatch: true });
      } else {
        confirmPassControl.setErrors(null);
      }
    };
  }

  get f() {
    return this.resetForm.controls;
  }
  

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    const resetSub = this.authService.resetPassword(this.token, this.resetForm.value.newPassword).subscribe(
      () => {
        alert('Password reset successfully. You can now log in.');
        this.router.navigate(['/login']);
      },
      () => {
        this.errorMessage = 'Failed to reset password. Try again.';
      }
    );
    this.subscriptions.add(resetSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Prevent memory leaks
  }
}
