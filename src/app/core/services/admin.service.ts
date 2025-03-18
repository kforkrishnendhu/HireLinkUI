import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


interface JobSeeker {
  userId: number;
  fullName: string;
  email: string;
}

interface Company {
  userId: number;
  fullName: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})


export class AdminService {
  private apiUrl = environment.apiUrl +'/Admin';

  constructor(private http: HttpClient) {}

  getJobSeekers(): Observable<{ success: boolean; data: JobSeeker[] }> {
    return this.http.get<{ success: boolean; data: JobSeeker[] }>(`${this.apiUrl}/jobseekers`);
  }

  deleteJobSeeker(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-jobseekers/${id}`);
  }

  getCompanies(): Observable<{ success: boolean; data: Company[] }> {
    return this.http.get<{ success: boolean; data: Company[] }>(`${this.apiUrl}/companies`);
  }

  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete-company/${id}`);
  }

  addCompany(company: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-company`, company);
  }
}