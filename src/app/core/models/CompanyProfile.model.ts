export interface CompanyProfile {
    companyId: number;
    companyName: string;
    industry:string;
    website?: string;
    location: string;
    companySize: string;
    aboutCompany?: string;
    companyLogo: string;
    backgroundDp: string;
    images: string[];
    workingDays?: string;
    isProfileCompleted: boolean;
    // jobOpenings: { title: string; location: string }[];    make it from another table. 
  }