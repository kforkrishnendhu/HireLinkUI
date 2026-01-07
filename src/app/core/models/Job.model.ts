export interface Job {
    jobId: number;
    companyId:number;
    jobTitle: string;
    jobDescription: string;
    requirements: string;
    location: string;
    jobType: string;
    salaryRange?: string;
    status: string;
    expiryDate?: Date;
  }
  