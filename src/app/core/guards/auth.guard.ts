import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const service=inject(AuthService);
  const token = service.getAccessToken();

  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};
