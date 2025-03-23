import { Router, Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { AuthService } from './core/services/auth.service';
import { inject } from '@angular/core';
import { AuthGuard } from './core/guards/auth.guard';
import { JobSeekerManagementComponent } from './features/admin/jobseeker-management/jobseeker-management.component';
import { AdminComponent } from './features/admin/admin/admin.component';
import { OtpVerificationComponent } from './features/auth/otp-verification/otp-verification.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { CompanyManagementComponent } from './features/admin/company-management/company-management.component';
import { UnauthorizedComponent } from './features/auth/unauthorized/unauthorized.component';
import { adminGuard } from './core/guards/admin.guard';
import { HomeComponent } from './features/auth/home/home.component';
import { JobSeekerComponent } from './features/job-seeker/job-seeker/job-seeker.component';
import { jobseekerGuard } from './core/guards/jobseeker.guard';
import { CompanyComponent } from './features/company/company/company.component';
import { companyGuard } from './core/guards/company.guard';

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
        component: HomeComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'otp-verification', component: OtpVerificationComponent },
            { path: 'unauthorized', component: UnauthorizedComponent }
        ]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard, adminGuard],
        children: [
            { path: 'jobseekers', component: JobSeekerManagementComponent },
            { path: 'company', component: CompanyManagementComponent },
            { path: 'dashboard', component: DashboardComponent }
        ]
    },
    {
        path: 'jobseeker',
        component: JobSeekerComponent,
        canActivate: [AuthGuard, jobseekerGuard],
        children: [
            { path: 'jobseekers', component: JobSeekerComponent }
        ]
    },
    {
        path: 'company',
        component: CompanyComponent,
        canActivate: [AuthGuard, companyGuard],
        children: [
            { path: 'company', component: CompanyComponent }
        ]
    },
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },  // Default Route
    { path: '**', redirectTo: 'auth/login' } // Fallback Route
];

