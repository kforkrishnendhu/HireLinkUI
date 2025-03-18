import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  constructor(private router:Router) {}

logout() {
    localStorage.removeItem('authToken'); // Remove token from storage
    this.router.navigate(['/auth/login']); // Redirect to login page
}

}
