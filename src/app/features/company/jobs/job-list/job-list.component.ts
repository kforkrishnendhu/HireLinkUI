import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalComponent } from '../../../../shared/modal/modal.component';
import { TableComponent } from '../../../../shared/table/table.component';
import { Job } from '../../../../core/models/Job.model';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { CompanyService } from '../../../../core/services/company.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule,ModalComponent,TableComponent],
  templateUrl: './job-list.component.html',
  styleUrl: './job-list.component.scss'
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  searchTerm = new Subject<string>();
  currentPage = 1;
  pageSize = 10;
  totalJobs = 0;
  selectedJob: Job | null = null;

  isViewModalOpen = false;
  isDeleteModalOpen = false;

  companyId = 0;

  columns = [
    { key: 'jobId', label: 'Job ID' },
    { key: 'jobTitle', label: 'Title' },
    { key: 'jobDescription', label: 'Description' },
    { key: 'requirements', label: 'Requirements' },
    { key: 'location', label: 'Location' },
    { key: 'jobType', label: 'JobType' },
    { key: 'salaryRange', label: 'Salary Range' }
  ];


  actions = [
    { label: 'View', icon: '👁️', action: 'view', class: 'text-blue-500 hover:text-blue-700' },
    { label: 'Delete', icon: '❌', action: 'delete', class: 'text-red-500 hover:text-red-700' }
  ];

  constructor(private companyService: CompanyService,private authService:AuthService) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
  if (userId !== null) {
    this.companyId = userId;
    this.loadJobs();
    this.setupSearchListener();
  } else {
    console.error('User ID not found.');
  }
  }

  setupSearchListener() {
    this.searchTerm.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(search => {
      this.currentPage = 1;
      this.loadJobs(search);
    });
  }

  onSearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.next(value);
  }

  loadJobs(search?: string) {
    this.companyService.getJobs(this.companyId, this.currentPage, this.pageSize, search).subscribe(response => {
      if (response.success && response.data) {
        this.jobs = response.data.jobs;
        this.filteredJobs = response.data.jobs;
        this.filteredJobs = this.jobs.map(job => ({
          ...job,
          salaryRange: `₹${job.salaryRange}` // Or format it as you like
        }));
        this.totalJobs = response.data.totalCount;
      } else {
        console.error('Invalid job API response:', response);
        this.jobs = [];
        this.filteredJobs = [];
        this.totalJobs = 0;
      }
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage = page;
    this.loadJobs();
  }

  totalPages(): number {
    return Math.ceil(this.totalJobs / this.pageSize);
  }

  handleTableAction(event: { action: string; row: Job }) {
    if (!event?.action || !event?.row) return;

    if (event.action === 'view') {
      this.viewJob(event.row.jobId);
    } else if (event.action === 'delete') {
      this.deleteJob(event.row.jobId);
    }
  }

  viewJob(jobId: number) {
    this.selectedJob = this.jobs.find(job => job.jobId === jobId) || null;
    this.isViewModalOpen = true;
  }

  deleteJob(jobId: number) {
    this.selectedJob = this.jobs.find(job => job.jobId === jobId) || null;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.selectedJob) {
      alert(this.selectedJob.jobId);
      this.companyService.deleteJob(this.selectedJob.jobId).subscribe({
        next: () => {
          this.jobs = this.jobs.filter(job => job.jobId !== this.selectedJob?.jobId);
          this.filteredJobs = [...this.jobs];
          this.isDeleteModalOpen = false;
        },
        error: err => {
          console.error('Error deleting job:', err);
          alert('Failed to delete job.');
        }
      });
    }
  }

  addJob() {
    // Optional: Add job functionality
    alert("Add Job clicked!");
  }
}
