import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalComponent } from "../../../shared/modal/modal.component";
import { JobSeeker } from '../../../core/models/JobSeeker.model'; 


@Component({
  selector: 'app-jobseeker-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalComponent],
  templateUrl: './jobseeker-management.component.html',
  styleUrl: './jobseeker-management.component.scss'
})
export class JobSeekerManagementComponent implements OnInit {
addUser() {
throw new Error('Method not implemented.');
}

  jobSeekers: JobSeeker[] = [];
  filteredJobSeekers: JobSeeker[] = [];
  searchQuery: string = '';

  selectedJobSeeker: JobSeeker | null = null;
  isViewModalOpen = false;
  isDeleteModalOpen = false;


  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadJobSeekers();
  }

  loadJobSeekers() {
    this.adminService.getJobSeekers().subscribe((response) => {
      if (response.success && Array.isArray(response.data)) {
        this.jobSeekers = response.data; // Extract the array
        this.filteredJobSeekers = response.data;
      } else {
        console.error('Unexpected API response format:', response);
        this.jobSeekers = [];
        this.filteredJobSeekers = [];
      }
      
    });
  }

  filterJobSeekers() {
    this.filteredJobSeekers = this.jobSeekers.filter(seeker =>
      seeker.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      seeker.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  trackById(index: number, jobseeker: JobSeeker) {
    return jobseeker.userId; 
  }

  viewUser(userId: number) {
    this.selectedJobSeeker = this.jobSeekers.find(seeker => seeker.userId === userId) || null;
    this.isViewModalOpen = true;
  }

  deleteUser(userId: number) {
    this.selectedJobSeeker = this.jobSeekers.find(seeker => seeker.userId === userId) || null;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.selectedJobSeeker) {
      this.adminService.deleteJobSeeker(this.selectedJobSeeker.userId).subscribe({
        next: () => {
          this.jobSeekers = this.jobSeekers.filter(seeker => seeker.userId !== this.selectedJobSeeker?.userId);
          this.isDeleteModalOpen = false;
          this.filteredJobSeekers = [...this.jobSeekers]; // Ensure UI updates
        },
        error: (err) => {
          console.error('Error deleting job seeker:', err);
          alert('Failed to delete job seeker.');
        }
      });
    }
  }
}
