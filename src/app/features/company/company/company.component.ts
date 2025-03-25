import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [],
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss'
})
export class CompanyComponent implements OnInit {
  
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
