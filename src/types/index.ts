export type UserRole = 'company' | 'investor';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
  createdAt: string;
}

export interface CompanyProfile {
  id?: string;
  ownerUid: string;
  companyName: string;
  address: string;
  ownerName: string;
  nifNumber: string;
  idCardUrl?: string;
  isVerified: boolean;
  updatedAt: string;
}

export interface FinancialData {
  id?: string;
  companyUid: string;
  purchases: number;
  sales: number;
  expenses: number;
  revenue: number;
  profit: number;
  period: string;
  createdAt: string;
}

export interface StrategyWarranty {
  id?: string;
  companyUid: string;
  marketingStrategy: string;
  salesStrategy: string;
  warrantyProofUrl?: string;
  isWarrantyCertified: boolean;
  updatedAt: string;
}

export interface ConfidenceRating {
  id?: string;
  companyUid: string;
  score: number;
  readiness: 'Low' | 'Medium' | 'High';
  isPromoted: boolean;
  breakdown: {
    financialHealth: number;
    documentation: number;
    warranty: number;
  };
  updatedAt: string;
}
