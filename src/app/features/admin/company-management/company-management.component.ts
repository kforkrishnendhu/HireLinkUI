import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { Company } from '../../../core/models/Company.model';
import { TableComponent } from '../../../shared/table/table.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { CompanyProfile } from '../../../core/models/CompanyProfile.model';



@Component({
  selector: 'app-company-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalComponent, TableComponent],
  templateUrl: './company-management.component.html',
  styleUrl: './company-management.component.scss'
})
export class CompanyManagementComponent implements OnInit {


  companies: Company[] = [];
  filteredCompanies: Company[] = [];
  searchQuery = '';
  searchTerm = new Subject<string>(); // RxJS Subject for debouncing

  // Pagination properties
  currentPage = 1;
  pageSize = 10; // Number of companies per page
  totalCompanies = 0; // Total companies count from the backend

  selectedCompany: Company | null = null;
  isViewModalOpen = false;
  isDeleteModalOpen = false;
  isAddModalOpen = false;


  companyName = '';
  companyEmail = '';
  companyWebsite = '';

  columns = [
    { key: 'userId', label: 'Company Id' },
    { key: 'fullName', label: 'Name' },
    { key: 'email', label: 'Email' }
  ];

  actions = [
    { label: 'View', icon: '👁️', action: 'view', class: 'text-blue-500 hover:text-blue-700' },
    { label: 'Delete', icon: '❌', action: 'delete', class: 'text-red-500 hover:text-red-700' }
  ];

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadCompanies();
    this.setupSearchListener();
  }

  setupSearchListener() {
    this.searchTerm.pipe(
      debounceTime(500), // Wait 500ms after last input
      distinctUntilChanged() // Ignore duplicate consecutive values
    ).subscribe(search => {
      this.currentPage = 1; // Reset to first page on search
      this.loadCompanies(search);
    });
  }

  onSearchInput(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.searchTerm.next(searchValue); // Emit search term
  }


  loadCompanies(search?: string) {
    this.adminService.getCompanies(this.currentPage, this.pageSize, search).subscribe((response) => {
      if (response.success && response.data) {
        this.companies = response.data.companies; // Extract paginated companies list
        this.totalCompanies = response.data.totalCount; // Total company count for pagination
        this.filteredCompanies = response.data.companies; 
      } else {
        console.error('Unexpected API response format:', response);
        this.companies = [];
        this.totalCompanies = 0;
        this.filteredCompanies = [];
      }

    });
  }

 // Pagination methods
 goToPage(page: number) {
  if (page < 1 || page > this.totalPages()) return;
  this.currentPage = page;
  this.loadCompanies();
}

totalPages(): number {
  return Math.ceil(this.totalCompanies / this.pageSize);
}

  // Client side search
  ////
  // filterCompanies() {
  //   this.filteredCompanies = this.companies.filter(company =>
  //     company.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
  //     company.email.toLowerCase().includes(this.searchQuery.toLowerCase())
  //   );
  // }

  handleTableAction(event: { action: string, row: Company }) {
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
    this.selectedCompany = this.companies.find(company => company.userId === userId) || null;
    this.isViewModalOpen = true;
  }

  deleteUser(userId: number) {
    this.selectedCompany = this.companies.find(company => company.userId === userId) || null;
    this.isDeleteModalOpen = true;
  }

  confirmDelete() {
    if (this.selectedCompany) {
      this.adminService.deleteCompany(this.selectedCompany.userId).subscribe({
        next: () => {
          this.companies = this.companies.filter(company => company.userId !== this.selectedCompany?.userId);
          this.isDeleteModalOpen = false;
          this.filteredCompanies = [...this.companies]; // Ensure UI updates
        },
        error: (err) => {
          console.error('Error deleting company:', err);
          alert('Failed to delete company.');
        }
      });
    }
  }

  openAddCompanyModal() {
    this.isAddModalOpen = true;
  }

  submitCompany() {
    const newCompany : CompanyProfile = {
      website: this.companyWebsite,
      companyId: 0,
      companyName: '',
      industry: '',
      location: '',
      companySize: '',
      companyLogo: '',
      backgroundDp: '',
      images: []
    };

    this.adminService.addCompany(newCompany).subscribe(() => {
      alert('Company added successfully');
      this.isAddModalOpen = false;
    });
  }
}

