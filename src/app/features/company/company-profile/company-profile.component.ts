import { Component, OnInit } from '@angular/core';
import { CompanyProfile } from '../../../core/models/CompanyProfile.model';
import { CompanyService } from '../../../core/services/company.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EditCompanyProfileComponent } from '../edit-company-profile/edit-company-profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CompanyState } from '../../../core/state/company.state';

@Component({
  selector: 'app-company-profile',
  standalone: true,
  imports: [CommonModule,EditCompanyProfileComponent,ReactiveFormsModule],
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.scss'
})
export class CompanyProfileComponent implements OnInit {
  company: CompanyProfile ={
    companyId: 0,
    companyName: '',
    industry: '',
    location: '',
    companySize: '',
    companyLogo: '',
    backgroundDp: '',
    images: [],
    isProfileCompleted: false
  };
  isLoading = true;
  showEditForm = false;
  companyProfile: CompanyProfile = {} as CompanyProfile;

  companyId = 0;
  constructor(private companyService: CompanyService, private route: ActivatedRoute, private authService: AuthService, private companyState:CompanyState) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId !== null) {
      this.companyId = userId;
      this.loadCompanyProfile(this.companyId);
    } else {
      console.error('User ID not found.');
    }

  }

  loadCompanyProfile(companyId: number) {
    this.companyService.getCompanyProfile(companyId).subscribe({
      next: (response) => {
        if (response.success) {
          this.company = response.data;
          this.companyProfile=response.data;
          this.companyState.isProfileCompleted.set(response.data.isProfileCompleted);
          console.log(response.data)
        } else {
          console.error('Failed to load company profile');
        }
      },
      error: (err) => {
        console.error('Error loading company profile:', err);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  updateCompanyProfile(updatedProfile: CompanyProfile) {
    this.companyService
      .updateCompanyProfile(this.companyId, updatedProfile)
      .subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Update success:');
            this.companyProfile = response.data;
            this.company = response.data;
            this.companyState.isProfileCompleted.set(response.data.isProfileCompleted);
            this.showEditForm = false;
          } else {
            console.error('Update failed:');
          }
        },
        error: (err) => {
          console.error('Error during update:', err);
        }
      });
  }
}