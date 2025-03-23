import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalComponent } from "../../../shared/modal/modal.component";
import { JobSeeker } from '../../../core/models/JobSeeker.model';
import { TableComponent } from '../../../shared/table/table.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';


@Component({
  selector: 'app-jobseeker-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalComponent, TableComponent],
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
  searchTerm = new Subject<string>(); // RxJS Subject for debouncing

  // Pagination properties
  currentPage: number = 1;
  pageSize: number = 10; // Number of jobseekers per page
  totalJobseekers: number = 0; // Total jobseekers count from the backend

  selectedJobSeeker: JobSeeker | null = null;
  isViewModalOpen = false;
  isDeleteModalOpen = false;

  columns = [
    { key: 'userId', label: 'User ID' },
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' }
  ];

  actions = [
    { label: 'View', icon: '👁️', action: 'view', class: 'text-blue-500 hover:text-blue-700' },
    { label: 'Delete', icon: '❌', action: 'delete', class: 'text-red-500 hover:text-red-700' }
  ];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadJobSeekers();
    this.setupSearchListener();
  }

  setupSearchListener() {
    this.searchTerm.pipe(
      debounceTime(500), // Wait 500ms after last input
      distinctUntilChanged() // Ignore duplicate consecutive values
    ).subscribe(search => {
      this.currentPage = 1; // Reset to first page on search
      this.loadJobSeekers(search);
    });
  }

  onSearchInput(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.searchTerm.next(searchValue); // Emit search term
  }

  loadJobSeekers(search?: string) {
    this.adminService.getJobSeekers(this.currentPage, this.pageSize, search).subscribe((response) => {
      if (response.success && response.data) {
        this.jobSeekers = response.data.jobSeekers; // Extract paginated companies list
        this.totalJobseekers = response.data.totalCount; // Total company count for pagination
        this.filteredJobSeekers = response.data.jobSeekers;
      } else {
        console.error('Unexpected API response format:', response);
        this.jobSeekers = []; // Extract paginated companies list
        this.totalJobseekers = 0; // Total company count for pagination
        this.filteredJobSeekers = [];
      }

    });
  }
  // Pagination methods
  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
    this.loadJobSeekers();
  }

  totalPages(): number {
    return Math.ceil(this.totalJobseekers / this.pageSize);
  }

  // Client side search
  ////
  // filterJobSeekers() {
  //   this.filteredJobSeekers = this.jobSeekers.filter(seeker =>
  //     seeker.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
  //     seeker.email.toLowerCase().includes(this.searchQuery.toLowerCase())
  //   );
  // }

  handleTableAction(event: { action: string, row: JobSeeker }) {
    console.log('Received event:', event);
    if (!event || !event.action || !event.row) {
      console.error('Invalid event format:', event);
      return;
    }

    const { action, row } = event;

    if (action === 'view') {
      this.viewUser(row.userId);
    } else if (action === 'delete') {
      this.deleteUser(row.userId);
    }
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
