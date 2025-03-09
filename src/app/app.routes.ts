import { Router, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AuthService } from './core/services/auth.service';
import { inject } from '@angular/core';
import { AuthGuard } from './core/guards/auth.guard';
import { JobSeekerManagementComponent } from './features/admin/jobseeker-management/jobseeker-management.component';
import { AdminComponent } from './features/admin/admin/admin.component';
import { OtpVerificationComponent } from './features/auth/otp-verification/otp-verification.component';

const roleGuard = (role: string) => () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (authService.getUserRole() !== role) {
      router.navigate(['/unauthorized']);
      return false;
    }
    return true;
  };

export const routes: Routes = [
    {
        path: 'auth',
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'otp-verification', component: OtpVerificationComponent }
        ]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard, roleGuard('Admin')],
        children: [
            { path: 'jobseekers', component: JobSeekerManagementComponent },
            //{ path: 'companies', component: CompanyManagementComponent }
        ]
    },
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },  // Default Route
    { path: '**', redirectTo: 'auth/login' } // Fallback Route
];

