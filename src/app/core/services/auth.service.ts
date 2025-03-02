import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

interface LoginResponse {
  message: string;
  token?: string;  // Token is only present on success
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private apiUrl='https://localhost:7185/api/Auth';

  constructor(private http:HttpClient, private router:Router) { }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password });
  }

  register(fullName: string, email: string, password: string, role: string): Observable<any> {
    const userRegisterDto = {
      fullName,
      email,
      password,
      role
    };
    return this.http.post<any>(`${this.apiUrl}/register`, userRegisterDto);
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/auth/login']);
  }
}
