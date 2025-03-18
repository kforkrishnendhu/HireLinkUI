import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../models/LoginResponse';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/Auth';
  private accessTokenKey = 'accessToken';
  private refreshTokenKey = 'refreshToken';


  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.accessToken && response.refreshToken) {
          // console.log(response.accessToken);
          this.saveToken(response.accessToken, response.refreshToken);
        }
      })
    );
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

  refreshAccessToken(): Observable<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token found'));
    }

    return this.http.post<{ token: string; refreshToken: string }>(
      `${this.apiUrl}/refresh-token`, 
      { refreshToken }
    ).pipe(
      tap(response => {
        this.saveToken(response.token,response.refreshToken);
      }),
      map(response => response.token), // Extract only accessToken for return type
      catchError(() => {
        this.logout();
        return throwError(() => new Error('Session expired. Please log in again.'));
      })
    );
  }

  // Save token to local storage
  saveToken(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  }


  saveAccessToken(accessToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  // Extract user role from token
  getUserRole(): string | null {
    const token = this.getAccessToken();
    console.log(token);
    if (!token) {
      console.error('No access token found.');
      return null;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      console.log('Decoded Token:', decodedToken);
      
      return (
        decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        decodedToken['role'] ||
        null
      );
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
}



  isTokenExpired(token: string): boolean {
    const decodedToken: any = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  }

  // Check if user is logged in

  isLoggedIn(): boolean {
    const token = this.getAccessToken();
    return token ? !this.isTokenExpired(token) : false;
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.router.navigate(['/auth/login']);
  }
}
