import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { PasswordValidatorDirective } from '../../../validators/password-validator.directive';
import { UserRole } from '../../../core/models/user-role.enum';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule,ReactiveFormsModule,PasswordValidatorDirective],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})


export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  errorMessage: string = '';
  role!: UserRole;
  private authSubscription?: Subscription; // Store subscription reference


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const roleParam = params['role'];

      if (roleParam && Object.values(UserRole).includes(roleParam as UserRole)) {
        this.role = roleParam as UserRole;  // Type-safe conversion
      } else {
        this.role = UserRole.JobSeeker; // Set default role
      }
    });

    // Initialize form with validation
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],  // PasswordValidatorDirective will be applied in template
      confirmPassword: ['', Validators.required]
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
    return this.registerForm.controls;
  }

  register() {
    this.submitted = true;
    
    if (this.registerForm.invalid) {
      return;
    }

    const { fullName, email, password, confirmPassword } = this.registerForm.value;

    this.authSubscription = this.authService.register(fullName, email, password, confirmPassword, this.role).subscribe({
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

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}

