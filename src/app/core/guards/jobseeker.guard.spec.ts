import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { jobseekerGuard } from './jobseeker.guard';

describe('jobseekerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => jobseekerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
