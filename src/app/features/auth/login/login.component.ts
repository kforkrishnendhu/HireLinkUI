import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.authService.saveToken(response.token || '');
        const userRole = this.authService.getUserRole();
        alert(userRole);

        if (userRole === 'Admin') {
          this.router.navigate(['/admin']);
        } else if (userRole === 'Company') {
          this.router.navigate(['/company-dashboard']);
        } else {
          this.router.navigate(['/jobseeker-dashboard']);
        }
      },
      error: (err) => {
        console.error('Login failed:', err.error.message);
      }
    });
  }
}
