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
import { HomeComponent } from './features/auth/home/home.component';
import { JobSeekerComponent } from './features/job-seeker/job-seeker/job-seeker.component';
import { CompanyComponent } from './features/company/company/company.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { CompanyProfileComponent } from './features/company/company-profile/company-profile.component';
import { CompanyDashboardComponent } from './features/company/company-dashboard/company-dashboard.component';
import { JobSeekerDashboardComponent } from './features/job-seeker/job-seeker-dashboard/job-seeker-dashboard.component';

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
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'reset-password', component: ResetPasswordComponent },
            { path: 'unauthorized', component: UnauthorizedComponent }
        ]
    },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard, roleGuard("Admin")],
        children: [
            { path: 'jobseekers', component: JobSeekerManagementComponent },
            { path: 'company', component: CompanyManagementComponent },
            { path: 'dashboard', component: DashboardComponent }
        ]
    },
    {
        path: 'jobseeker',
        component: JobSeekerComponent,
        canActivate: [AuthGuard, roleGuard("JobSeeker")],
        children: [
            { path: 'jobseekers', component: JobSeekerComponent },
            { path: 'job-seeker-dashboard', component: JobSeekerDashboardComponent },
        ]
    },
    {
        path: 'company',
        component: CompanyComponent,
        canActivate: [AuthGuard, roleGuard("Company")],
        children: [
            { path: 'company', component: CompanyComponent },
            { path: 'company-profile', component: CompanyProfileComponent },
            { path: 'company-dashboard', component: CompanyDashboardComponent },
            { path: 'jobs/job-list', loadComponent: () => import('./features/company/jobs/job-list/job-list.component').then(m => m.JobListComponent) }
        ]
    },
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },  // Default Route
    { path: '**', redirectTo: 'auth/login' } // Fallback Route
];

