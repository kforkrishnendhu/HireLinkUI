import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss'
})
export class OtpVerificationComponent implements OnInit {
  otpForm!: FormGroup;
  submitted = false;
  errorMessage: string | null = null;
  email: string = '';
  countdown: number = 60; // Timer starts from 60 seconds
  timerActive: boolean = true; // Timer is active initially
  interval: any;
  private subscriptions: Subscription = new Subscription(); // Store all subscriptions


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const queryParamsSub = this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.email = params['email'];
      }
    });

    this.subscriptions.add(queryParamsSub); // Add to subscriptions

    this.startCountdown();
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  get f() {
    return this.otpForm.controls;
  }

  startCountdown() {
    this.timerActive = true;
    this.countdown = 60; // Reset timer to 60 seconds

    this.interval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.timerActive = false; // Enable "Resend OTP" button
        clearInterval(this.interval);
      }
    }, 1000);
  }


  verifyOtp() {
    this.submitted = true;
    if (this.otpForm.invalid) {
      return;
    }

    const { otp } = this.otpForm.value;

    const verifySub = this.authService.verifyOtp(this.email, otp).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('OTP Verified Successfully:', response);
          alert('OTP Verified! Redirecting to Login...');
          this.router.navigate(['auth/login']); // Redirect to login page
        }
        else {
          this.errorMessage = 'Invalid OTP. Please try again.';
        }

      },
      error: (err) => {
        console.error('OTP Verification Failed:', err.error.message);
        this.errorMessage = err.error.message || 'Invalid OTP. Please try again.';
      }
    });

    this.subscriptions.add(verifySub); // Add to subscriptions

  }

  resendOtp() {
    const resendSub = this.authService.resendOtp(this.email).subscribe({
      next: (response) => {
        console.log('OTP Resent Successfully:', response);
        alert('A new OTP has been sent to your email.');
        this.startCountdown(); // Restart timer after OTP is resent
      },
      error: (err) => {
        console.error('Failed to resend OTP:', err.error.message);
        this.errorMessage = err.error.message || 'Failed to resend OTP. Please try again.';
      }
    });

    this.subscriptions.add(resendSub); // Add to subscriptions

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Unsubscribe from all subscriptions
    clearInterval(this.interval); // Clear the countdown timer
  }

}
