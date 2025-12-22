import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JobSeeker } from '../models/JobSeeker.model';
import { Company } from '../models/Company.model';
import { CompanyProfile } from '../models/CompanyProfile.model';


@Injectable({
  providedIn: 'root'
})


export class AdminService {
  private apiUrl = environment.apiUrl +'/Admin';

  constructor(private http: HttpClient) {}

  getJobSeekers(page = 1, pageSize = 10, search?: string): Observable<{ success: boolean; data: { jobSeekers: JobSeeker[]; totalCount: number } }> {
    let url = `${this.apiUrl}/jobseekers?page=${page}&pageSize=${pageSize}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return this.http.get<{ success: boolean; data: { jobSeekers: JobSeeker[]; totalCount: number } }>(url);
  }

  deleteJobSeeker(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-jobseekers/${id}`);
  }

  getCompanies(page = 1, pageSize = 10,search?: string): Observable<{ success: boolean; data: { companies: Company[]; totalCount: number } }> {
    let url = `${this.apiUrl}/companies?page=${page}&pageSize=${pageSize}`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }
    return this.http.get<{ success: boolean; data: { companies: Company[]; totalCount: number } }>(url);
  }

  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-company/${id}`);
  }

  addCompany(company: CompanyProfile): Observable<CompanyProfile> {
    return this.http.post<CompanyProfile>(`${this.apiUrl}/add-company`, company);
  }
}