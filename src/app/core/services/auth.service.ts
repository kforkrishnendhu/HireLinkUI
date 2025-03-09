import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';

interface LoginResponse {
  message: string;
  token?: string;  // Token is only present on success
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 private apiUrl= environment.apiUrl +'/Auth';       
 private tokenKey = 'authToken';

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

  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, { email, otp });
  }

  resendOtp(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/resend-otp`, { email });
  }
  
  // Save token to local storage
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Get token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Extract user role from token
  getUserRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
    return (
      decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
      decodedToken['role'] || 
      null
    );
    }
    return null;
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/auth/login']);
  }
}
