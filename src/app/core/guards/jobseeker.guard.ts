import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const jobseekerGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService=inject(AuthService);
  const role = authService.getUserRole();

  if (role !== 'JobSeeker') {
    router.navigate(['/auth/unauthorized']);
    return false;
  }
  return true;
};
