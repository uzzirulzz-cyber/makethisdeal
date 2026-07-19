import {
  Globe, Building2, Store, ShoppingBag, Laptop, HandCoins,
  Factory, Smartphone, Landmark, Home, Briefcase, Cpu, Shield,
  GraduationCap, HeartPulse, BarChart3, ShoppingCart, Truck,
  Warehouse, Globe2, Rocket, TrendingUp, CircleDollarSign, Star,
  FileText, Palette, Video, Gamepad2, Lightbulb, Database,
  Cloud, Server, Blocks, Bot, Brain, Workflow, PieChart
} from 'lucide-react';
import type { Category } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'SaaS', slug: 'saas', icon: 'Laptop', description: 'Software as a Service applications', order: 1 },
  { id: '2', name: 'AI Solutions', slug: 'ai-solutions', icon: 'Brain', description: 'Artificial Intelligence products & services', order: 2 },
  { id: '3', name: 'E-commerce', slug: 'ecommerce', icon: 'ShoppingCart', description: 'Online stores & retail platforms', order: 3 },
  { id: '4', name: 'Real Estate', slug: 'real-estate', icon: 'Home', description: 'Residential, commercial & industrial properties', order: 4 },
  { id: '5', name: 'Mobile Apps', slug: 'mobile-apps', icon: 'Smartphone', description: 'iOS & Android applications', order: 5 },
  { id: '6', name: 'Startups', slug: 'startups', icon: 'Rocket', description: 'Early-stage & growing startups', order: 6 },
  { id: '7', name: 'FinTech', slug: 'fintech', icon: 'Landmark', description: 'Financial technology solutions', order: 7 },
  { id: '8', name: 'HealthTech', slug: 'healthtech', icon: 'HeartPulse', description: 'Healthcare technology platforms', order: 8 },
  { id: '9', name: 'EdTech', slug: 'edtech', icon: 'GraduationCap', description: 'Educational technology solutions', order: 9 },
  { id: '10', name: 'Cybersecurity', slug: 'cybersecurity', icon: 'Shield', description: 'Security solutions & services', order: 10 },
  { id: '11', name: 'CRM/ERP', slug: 'crm-erp', icon: 'PieChart', description: 'Customer & enterprise resource management', order: 11 },
  { id: '12', name: 'Retail', slug: 'retail', icon: 'Store', description: 'Physical retail businesses & brands', order: 12 },
  { id: '13', name: 'Wholesale', slug: 'wholesale', icon: 'Warehouse', description: 'Distributors, manufacturers & supply chains', order: 14 },
  { id: '14', name: 'Investments', slug: 'investments', icon: 'TrendingUp', description: 'Funding, equity & joint ventures', order: 15 },
  { id: '15', name: 'Domains', slug: 'domains', icon: 'Globe', description: 'Premium domains & digital real estate', order: 16 },
  { id: '16', name: 'Digital Products', slug: 'digital-products', icon: 'FileText', description: 'Digital assets, content & media', order: 17 },
  { id: '17', name: 'Manufacturing', slug: 'manufacturing', icon: 'Factory', description: 'Production & industrial businesses', order: 18 },
  { id: '18', name: 'Websites', slug: 'websites', icon: 'Globe2', description: 'Established websites & web properties', order: 19 },
];

/* Resolve category slug to display name */
export function getCategoryName(slugOrName: string): string {
  if (!slugOrName) return '';
  const found = CATEGORIES.find(
    (c) => c.slug === slugOrName || c.name === slugOrName
  );
  return found ? found.name : slugOrName;
}

/* Resolve category slug to icon name key */
export function getCategoryIconKey(slugOrName: string): string {
  const found = CATEGORIES.find(
    (c) => c.slug === slugOrName || c.name === slugOrName
  );
  if (found && found.icon && CATEGORY_ICONS[found.icon]) return found.icon;
  return 'PackageOpen';
}

export const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Laptop, Brain, ShoppingCart, Home, Smartphone, Rocket, Landmark,
  HeartPulse, GraduationCap, Shield, PieChart, Store, Warehouse,
  TrendingUp, Globe, FileText, Factory, Globe2,
};

export const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Japan', 'South Korea', 'Singapore', 'UAE', 'Saudi Arabia',
  'India', 'Pakistan', 'China', 'Brazil', 'Mexico', 'Nigeria', 'South Africa',
  'Turkey', 'Indonesia', 'Malaysia', 'Thailand', 'Netherlands', 'Sweden',
  'Switzerland', 'Spain', 'Italy', 'Poland', 'Ireland', 'Israel'
];

export const BUSINESS_STAGES = [
  { value: 'idea', label: 'Idea / Concept' },
  { value: 'startup', label: 'Startup' },
  { value: 'growth', label: 'Growth Stage' },
  { value: 'mature', label: 'Mature Business' },
  { value: 'exit', label: 'Exit / Acquisition' },
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'roi_high', label: 'Highest ROI' },
  { value: 'revenue_high', label: 'Highest Revenue' },
  { value: 'popular', label: 'Most Popular' },
];

export const STATS = [
  { label: 'Featured Listings', value: '4', icon: Star },
  { label: 'Growth Stage', value: '3', icon: TrendingUp },
  { label: 'Startup Stage', value: '3', icon: Rocket },
  { label: 'Pakistan Based', value: '7', icon: HandCoins },
];

export const TECHNOLOGY_STACKS = [
  'React', 'Next.js', 'Vue.js', 'Angular', 'Node.js', 'Python', 'Django',
  'Flask', 'Ruby on Rails', 'Laravel', 'WordPress', 'Shopify', 'Magento',
  'Flutter', 'React Native', 'Swift', 'Kotlin', 'Go', 'Rust', 'PostgreSQL',
  'MongoDB', 'Redis', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
  'TensorFlow', 'PyTorch', 'OpenAI', 'Stripe', 'Firebase', 'Supabase'
];