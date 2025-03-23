import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserRole } from '../../../core/models/user-role.enum';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
UserRole=UserRole;
}
