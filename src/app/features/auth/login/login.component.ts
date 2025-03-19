import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  private fb = inject(FormBuilder);
  loginForm!: FormGroup;
  errorMessage: string | null = null;
  submitted =false; 
  private authSubscription?: Subscription; // Store subscription reference


  constructor(private authService: AuthService,private router:Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
  // Getter for easy form field access
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted=true;
    if (this.loginForm.invalid)
    {
      // this.errorMessage='invalid credentials';
      return;
    }
  
    const { email, password } = this.loginForm.value;
    
    this.authSubscription = this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        // this.authService.saveToken((response.accessToken, response.refreshToken )|| '','');
        const userRole = this.authService.getUserRole();

        setTimeout(() => {
          console.log('Navigating after saving token...');
          if (userRole === 'Admin') {
            this.router.navigate(['/admin/dashboard']);
          } else if (userRole === 'Company') {
            this.router.navigate(['/company-dashboard']);
          } else {
            this.router.navigate(['/jobseeker-dashboard']);
          }
        }, 100);
        
        // if (userRole === 'Admin') {
        //   this.router.navigate(['/admin/dashboard']);
        // } else if (userRole === 'Company') {
        //   this.router.navigate(['/company-dashboard']);
        // } else {
        //   this.router.navigate(['/jobseeker-dashboard']);
        // }
      },
      error: (err) => {
        this.errorMessage = err.error.message;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  
}
