import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../core/services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { Company } from '../../../core/models/Company.model'; 



@Component({
  selector: 'app-company-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ModalComponent],
  templateUrl: './company-management.component.html',
  styleUrl: './company-management.component.scss'
})
export class CompanyManagementComponent implements OnInit {
  
  
    companies: Company[] = [];
    filteredCompanies: Company[] = [];
    searchQuery: string = '';
  
    selectedCompany: Company | null = null;
    isViewModalOpen = false;
    isDeleteModalOpen = false;
    isAddModalOpen = false;
  
  
    companyName = '';
    companyEmail = '';
    companyWebsite = '';

    constructor(private adminService: AdminService) {}
  
    ngOnInit(): void {
      this.loadCompanies();
    }
  
    loadCompanies() {
      this.adminService.getCompanies().subscribe((response) => {
        if (response.success && Array.isArray(response.data)) {
          this.companies = response.data; // Extract the array
          this.filteredCompanies = response.data;
        } else {
          console.error('Unexpected API response format:', response);
          this.companies = [];
          this.filteredCompanies = [];
        }
        
      });
    }
  
    filterCompanies() {
      this.filteredCompanies = this.companies.filter(company =>
        company.fullName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        company.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }


  trackById(index: number, company: Company) {
    return company.userId; 
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

    openAddCompanyModal()
    {
      this.isAddModalOpen = true;
    }

    submitCompany() {
      const newCompany = {
        name: this.companyName,
        email: this.companyEmail,
        website: this.companyWebsite,
      };
  
      this.adminService.addCompany(newCompany).subscribe(() => {
        alert('Company added successfully');
        this.isAddModalOpen = false;
      });
    }
  }
  
