import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const companyGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService=inject(AuthService);
  const role = authService.getUserRole();

  if (role !== 'Company') {
    router.navigate(['/auth/unauthorized']);
    return false;
  }
  return true;
};
