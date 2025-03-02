import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  
  fullName = '';
  email = '';
  password = '';
  role: string = 'JobSeeker'; // Default to JobSeeker
  errorMessage!: '';

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['role']) {
        this.role = params['role']; // Read role from URL
      }
    });
  }

  register() {
    this.authService.register(this.fullName, this.email, this.password, this.role).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        alert('Registration successful! Redirecting to login...');
        this.router.navigate(['auth/login']); // Redirect to login page
      },
      error: (err) => {
        console.error('Registration failed:', err.error.message);
        this.errorMessage = err.error.message || 'Registration failed. Please try again.';
      }
    });
  }
}
