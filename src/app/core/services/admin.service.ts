import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl +'/Admin';

  constructor(private http: HttpClient) {}

  getJobSeekers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  deleteJobSeeker(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}