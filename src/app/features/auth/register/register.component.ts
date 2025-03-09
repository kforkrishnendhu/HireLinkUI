import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})


export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  errorMessage: string = '';
  role: string = 'JobSeeker'; // Default role

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['role']) {
        this.role = params['role']; // Read role from URL
      }
    });

    // Initialize form with validation
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  register() {
    this.submitted = true;
    
    if (this.registerForm.invalid) {
      return;
    }

    const { fullName, email, password } = this.registerForm.value;

    this.authService.register(fullName, email, password, this.role).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        alert('Registration successful! Redirecting to OTP verification...');
        this.router.navigate(['auth/otp-verification'], { queryParams: { email } }); // Navigate to OTP Page
      },
      error: (err) => {
        console.error('Registration failed:', err.error.message);
        this.errorMessage = err.error.message || 'Registration failed. Please try again.';
      }
    });
  }
}

