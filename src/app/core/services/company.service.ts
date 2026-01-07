import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyProfile } from '../models/CompanyProfile.model';
import { Job } from '../models/Job.model';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private apiUrl = environment.apiUrl + '/Company';

  constructor(private http: HttpClient) { }

  getCompanyProfile(companyId: number): Observable<{ success: boolean; data: CompanyProfile }> {
    return this.http.get<{ success: boolean; data: CompanyProfile }>(`${this.apiUrl}/profile/${companyId}`);
  }

  updateCompanyProfile(companyId: number, profileData: Partial<CompanyProfile>): Observable<{ success: boolean; data: CompanyProfile }> {
    return this.http.put<{ success: boolean; data: CompanyProfile }>(`${this.apiUrl}/update-profile/${companyId}`, profileData);
  }

  getJobs(companyId: number, page = 1, pageSize = 10, search?: string): Observable<{
    success: boolean;
    data: {
      jobs: Job[];
      totalCount: number;
    };
  }> {

    const baseUrl = `${environment.apiUrl}/Job/jobs`;
    let url = `${baseUrl}?companyId=${companyId}&page=${page}&pageSize=${pageSize}`;


    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    return this.http.get<{
      success: boolean;
      data: {
        jobs: Job[];
        totalCount: number;
      };
    }>(url);
  }

  createJob(job: Job): Observable<{ success: boolean; data: Job; message: string }> {
    return this.http.post<{ success: boolean; data: Job; message: string }>(
      `${environment.apiUrl}/Job/create`,
      job
    );
  }  


  deleteJob(jobId: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${environment.apiUrl}/Job/delete-jobs/${jobId}`);
  }
}
