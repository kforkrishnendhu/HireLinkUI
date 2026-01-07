import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-job-seeker-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './job-seeker-dashboard.component.html',
  styleUrl: './job-seeker-dashboard.component.scss'
})
export class JobSeekerDashboardComponent implements OnInit{

  username: string | null = null;
  constructor(private authService:AuthService) {}

  ngOnInit() :void
  {

    this.username = this.authService.getUserEmail();
  }
  logout() {
  this.authService.logout();
  }
}
