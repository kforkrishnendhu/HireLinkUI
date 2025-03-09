import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface JobSeeker {
  id: number;
  name: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-jobseeker-management',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule],
  templateUrl: './jobseeker-management.component.html',
  styleUrl: './jobseeker-management.component.scss'
})
export class JobSeekerManagementComponent implements OnInit {
  jobSeekers: JobSeeker[] = [];
  filteredJobSeekers: JobSeeker[] = [];
  searchQuery: string = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadJobSeekers();
  }

  loadJobSeekers() {
    this.adminService.getJobSeekers().subscribe((data) => {
      this.jobSeekers = data;
      this.filteredJobSeekers = data;
    });
  }

  filterJobSeekers() {
    this.filteredJobSeekers = this.jobSeekers.filter(seeker =>
      seeker.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      seeker.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  addUser() {
    console.log('Navigate to Add User Form');
  }

  editUser(id: number) {
    console.log(`Editing user with ID: ${id}`);
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteJobSeeker(id).subscribe(() => {
        this.loadJobSeekers();
      });
    }
  }
}
