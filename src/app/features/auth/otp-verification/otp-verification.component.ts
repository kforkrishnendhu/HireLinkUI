import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class OtpVerificationComponent implements OnInit, OnDestroy {
  otpForm!: FormGroup;
  submitted = false;
  errorMessage: string | null = null;
  email = '';
  countdown = 60; 
  timerActive = true; 
  interval: number|null=null;
  private subscriptions: Subscription = new Subscription(); 


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

    this.subscriptions.add(queryParamsSub);

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
    this.countdown = 60; 

    this.interval = window.setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.timerActive = false; 
        if (this.interval !== null) {
          clearInterval(this.interval);
          this.interval = null;
        }
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
          this.router.navigate(['auth/login']); 
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
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

}
