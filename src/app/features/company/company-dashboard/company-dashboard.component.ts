import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-company-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './company-dashboard.component.html',
  styleUrl: './company-dashboard.component.scss'
})
export class CompanyDashboardComponent implements OnInit {

  username: string | null = null;
  constructor(private authService:AuthService) {}
  
  ngOnInit() :void
  {
  
    this.username = this.authService.getUserEmail();
  }
}
