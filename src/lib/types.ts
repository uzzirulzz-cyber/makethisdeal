export type ViewType = 'landing' | 'browse' | 'detail' | 'create' | 'dashboard' | 'auth';

export type UserRole = 'buyer' | 'seller' | 'investor' | 'broker' | 'admin';

export type BusinessStage = 'idea' | 'startup' | 'growth' | 'mature' | 'exit';

export type ProjectStatus = 'active' | 'sold' | 'paused' | 'draft';

export type OfferStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';

export interface Project {
  id: string;
  name: string;
  category: string;
  industry?: string;
  country?: string;
  city?: string;
  businessStage?: string;
  foundedYear?: number;
  status: string;
  visibility: string;
  featured: boolean;
  overview?: string;
  businessModel?: string;
  targetMarket?: string;
  revenueModel?: string;
  growthOpportunity?: string;
  competitiveAdvantage?: string;
  businessRisks?: string;
  exitOpportunities?: string;
  developmentCost?: number;
  infrastructureCost?: number;
  marketingCost?: number;
  legalCost?: number;
  operationalCost?: number;
  technologyCost?: number;
  maintenanceCost?: number;
  totalInvestment?: number;
  expectedROI?: number;
  monthlyRevenue?: number;
  annualRevenue?: number;
  netProfit?: number;
  ebitda?: number;
  breakEvenAnalysis?: string;
  companyValuation?: number;
  suggestedSellingPrice?: number;
  reservePrice?: number;
  minimumOffer?: number;
  buyNowPrice?: number;
  auctionEnabled: boolean;
  websiteUrl?: string;
  demoUrl?: string;
  githubRepo?: string;
  googlePlayUrl?: string;
  appleStoreUrl?: string;
  adminPanelDemo?: string;
  customerPortalDemo?: string;
  apiDocumentation?: string;
  sourceCodeAvailable: boolean;
  technologyStack?: string;
  hostingProvider?: string;
  cloudInfrastructure?: string;
  monthlyVisitors?: number;
  monthlyActiveUsers?: number;
  registeredUsers?: number;
  customers?: number;
  subscribers?: number;
  conversionRate?: number;
  trafficSources?: string;
  seoScore?: number;
  socialMediaLinks?: string;
  aiValuation?: number;
  investorPrice?: number;
  wholesalePrice?: number;
  acquisitionPrice?: number;
  valuationDetails?: string;
  images?: string;
  videos?: string;
  thumbnail?: string;
  tags?: string;
  sellerId: string;
  seller?: {
    id: string;
    name: string;
    company?: string;
    country?: string;
    avatar?: string;
    verified: boolean;
  };
  _count?: {
    offers: number;
    favorites: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  parent?: string;
  order: number;
  _count?: {
    projects: number;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  company?: string;
  country?: string;
  city?: string;
  avatar?: string;
  bio?: string;
  verified: boolean;
  createdAt: string;
}

export interface Offer {
  id: string;
  projectId: string;
  buyerId: string;
  amount: number;
  message?: string;
  status: string;
  createdAt: string;
  buyer?: User;
  project?: Project;
}

export interface SearchFilters {
  query?: string;
  category?: string;
  country?: string;
  priceMin?: number;
  priceMax?: number;
  revenueMin?: number;
  revenueMax?: number;
  roiMin?: number;
  businessStage?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}