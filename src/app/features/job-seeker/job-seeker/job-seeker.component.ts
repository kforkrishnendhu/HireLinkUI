import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-job-seeker',
  standalone: true,
  imports: [],
  templateUrl: './job-seeker.component.html',
  styleUrl: './job-seeker.component.scss'
})
export class JobSeekerComponent implements OnInit {

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
