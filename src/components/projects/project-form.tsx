'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  Sparkles,
  FileText,
  DollarSign,
  Globe,
  BarChart3,
  Eye,
  Plus,
  X,
} from 'lucide-react';
import { useAppStore } from '@/store/use-app-store';
import { CATEGORIES, COUNTRIES, BUSINESS_STAGES, TECHNOLOGY_STACKS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

/* ---------- Types ---------- */

interface FormData {
  // Step 1
  name: string;
  category: string;
  industry: string;
  country: string;
  city: string;
  businessStage: string;
  foundedYear: string;
  visibility: boolean;
  // Step 2
  overview: string;
  businessModel: string;
  targetMarket: string;
  revenueModel: string;
  growthOpportunity: string;
  competitiveAdvantage: string;
  businessRisks: string;
  exitOpportunities: string;
  // Step 3
  developmentCost: string;
  infrastructureCost: string;
  marketingCost: string;
  legalCost: string;
  operationalCost: string;
  technologyCost: string;
  maintenanceCost: string;
  monthlyRevenue: string;
  annualRevenue: string;
  netProfit: string;
  ebitda: string;
  expectedROI: string;
  companyValuation: string;
  suggestedSellingPrice: string;
  reservePrice: string;
  minimumOffer: string;
  buyNowPrice: string;
  breakEvenAnalysis: string;
  // Step 4
  websiteUrl: string;
  demoUrl: string;
  githubRepo: string;
  googlePlayUrl: string;
  appleStoreUrl: string;
  adminPanelDemo: string;
  customerPortalDemo: string;
  apiDocumentation: string;
  technologyStack: string[];
  hostingProvider: string;
  cloudInfrastructure: string;
  sourceCodeAvailable: boolean;
  // Step 5
  monthlyVisitors: string;
  monthlyActiveUsers: string;
  registeredUsers: string;
  customers: string;
  subscribers: string;
  conversionRate: string;
  seoScore: string;
  trafficSources: string;
}

const INITIAL_FORM: FormData = {
  name: '',
  category: '',
  industry: '',
  country: '',
  city: '',
  businessStage: '',
  foundedYear: '',
  visibility: true,
  overview: '',
  businessModel: '',
  targetMarket: '',
  revenueModel: '',
  growthOpportunity: '',
  competitiveAdvantage: '',
  businessRisks: '',
  exitOpportunities: '',
  developmentCost: '',
  infrastructureCost: '',
  marketingCost: '',
  legalCost: '',
  operationalCost: '',
  technologyCost: '',
  maintenanceCost: '',
  monthlyRevenue: '',
  annualRevenue: '',
  netProfit: '',
  ebitda: '',
  expectedROI: '',
  companyValuation: '',
  suggestedSellingPrice: '',
  reservePrice: '',
  minimumOffer: '',
  buyNowPrice: '',
  breakEvenAnalysis: '',
  websiteUrl: '',
  demoUrl: '',
  githubRepo: '',
  googlePlayUrl: '',
  appleStoreUrl: '',
  adminPanelDemo: '',
  customerPortalDemo: '',
  apiDocumentation: '',
  technologyStack: [],
  hostingProvider: '',
  cloudInfrastructure: '',
  sourceCodeAvailable: true,
  monthlyVisitors: '',
  monthlyActiveUsers: '',
  registeredUsers: '',
  customers: '',
  subscribers: '',
  conversionRate: '',
  seoScore: '',
  trafficSources: '',
};

/* ---------- Step Config ---------- */

const STEPS = [
  { id: 1, title: 'General Info', icon: FileText },
  { id: 2, title: 'Description', icon: FileText },
  { id: 3, title: 'Financials', icon: DollarSign },
  { id: 4, title: 'Digital Assets', icon: Globe },
  { id: 5, title: 'Metrics', icon: BarChart3 },
  { id: 6, title: 'Review', icon: Eye },
];

/* ---------- Shared Components ---------- */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-foreground mb-1">{children}</p>;
}

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <Label className="text-sm text-muted-foreground flex items-center gap-1">
      {children}
      {optional && <span className="text-xs font-normal">(optional)</span>}
    </Label>
  );
}

function CurrencyInput({
  label,
  optional,
  value,
  onChange,
}: {
  label: string;
  optional?: boolean;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <FieldLabel optional={optional}>{label}</FieldLabel>
      <div className="relative mt-1">
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
        <Input
          type="number"
          placeholder="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-6"
        />
      </div>
    </div>
  );
}

/* ---------- Step: General Info ---------- */

function StepGeneralInfo({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
  const update = (key: keyof FormData, value: string | boolean) =>
    setForm({ ...form, [key]: value });

  return (
    <div className="space-y-5">
      <div>
        <FieldLabel>Project Name *</FieldLabel>
        <Input
          placeholder="e.g. TaskFlow Pro"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Category *</FieldLabel>
          <Select value={form.category} onValueChange={(v) => update('category', v)}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.slug}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <FieldLabel optional>Industry</FieldLabel>
          <Input
            placeholder="e.g. B2B Software"
            value={form.industry}
            onChange={(e) => update('industry', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Country *</FieldLabel>
          <Select value={form.country} onValueChange={(v) => update('country', v)}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <FieldLabel optional>City</FieldLabel>
          <Input
            placeholder="e.g. San Francisco"
            value={form.city}
            onChange={(e) => update('city', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel>Business Stage *</FieldLabel>
          <Select value={form.businessStage} onValueChange={(v) => update('businessStage', v)}>
            <SelectTrigger className="mt-1 w-full">
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_STAGES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <FieldLabel optional>Founded Year</FieldLabel>
          <Input
            type="number"
            placeholder="e.g. 2022"
            value={form.foundedYear}
            onChange={(e) => update('foundedYear', e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <FieldLabel>Public Visibility</FieldLabel>
          <p className="text-xs text-muted-foreground mt-0.5">
            Make this project visible to all marketplace users
          </p>
        </div>
        <Switch
          checked={form.visibility}
          onCheckedChange={(v) => update('visibility', v)}
        />
      </div>
    </div>
  );
}

/* ---------- Step: Description ---------- */

function StepDescription({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
  const update = (key: keyof FormData, value: string) => setForm({ ...form, [key]: value });

  const fields: { key: keyof FormData; label: string; optional?: boolean; rows?: number }[] = [
    { key: 'overview', label: 'Overview', rows: 4 },
    { key: 'businessModel', label: 'Business Model', rows: 3 },
    { key: 'targetMarket', label: 'Target Market', rows: 3 },
    { key: 'revenueModel', label: 'Revenue Model', rows: 3, optional: true },
    { key: 'growthOpportunity', label: 'Growth Opportunity', rows: 3, optional: true },
    { key: 'competitiveAdvantage', label: 'Competitive Advantage', rows: 3, optional: true },
    { key: 'businessRisks', label: 'Business Risks', rows: 3, optional: true },
    { key: 'exitOpportunities', label: 'Exit Opportunities', rows: 3, optional: true },
  ];

  return (
    <div className="space-y-5">
      {fields.map((f) => (
        <div key={f.key}>
          <FieldLabel optional={f.optional}>{f.label}</FieldLabel>
          <Textarea
            placeholder={`Describe the ${f.label.toLowerCase()}...`}
            value={form[f.key] as string}
            onChange={(e) => update(f.key, e.target.value)}
            rows={f.rows || 3}
            className="mt-1 resize-none"
          />
        </div>
      ))}
    </div>
  );
}

/* ---------- Step: Financials ---------- */

function StepFinancials({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
  const update = (key: keyof FormData, value: string) => setForm({ ...form, [key]: value });

  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Costs & Investment</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          <CurrencyInput label="Development Cost" optional value={form.developmentCost} onChange={(v) => update('developmentCost', v)} />
          <CurrencyInput label="Infrastructure Cost" optional value={form.infrastructureCost} onChange={(v) => update('infrastructureCost', v)} />
          <CurrencyInput label="Marketing Cost" optional value={form.marketingCost} onChange={(v) => update('marketingCost', v)} />
          <CurrencyInput label="Legal Cost" optional value={form.legalCost} onChange={(v) => update('legalCost', v)} />
          <CurrencyInput label="Operational Cost" optional value={form.operationalCost} onChange={(v) => update('operationalCost', v)} />
          <CurrencyInput label="Technology Cost" optional value={form.technologyCost} onChange={(v) => update('technologyCost', v)} />
          <CurrencyInput label="Maintenance Cost" optional value={form.maintenanceCost} onChange={(v) => update('maintenanceCost', v)} />
        </div>
      </div>

      <Separator />

      <div>
        <SectionLabel>Revenue & Profit</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          <CurrencyInput label="Monthly Revenue" optional value={form.monthlyRevenue} onChange={(v) => update('monthlyRevenue', v)} />
          <CurrencyInput label="Annual Revenue" value={form.annualRevenue} onChange={(v) => update('annualRevenue', v)} />
          <CurrencyInput label="Net Profit" optional value={form.netProfit} onChange={(v) => update('netProfit', v)} />
          <CurrencyInput label="EBITDA" optional value={form.ebitda} onChange={(v) => update('ebitda', v)} />
          <div>
            <FieldLabel optional>Expected ROI (%)</FieldLabel>
            <div className="relative mt-1">
              <Input
                type="number"
                placeholder="e.g. 150"
                value={form.expectedROI}
                onChange={(e) => update('expectedROI', e.target.value)}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <SectionLabel>Valuation & Pricing</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          <CurrencyInput label="Company Valuation" optional value={form.companyValuation} onChange={(v) => update('companyValuation', v)} />
          <CurrencyInput label="Suggested Selling Price" value={form.suggestedSellingPrice} onChange={(v) => update('suggestedSellingPrice', v)} />
          <CurrencyInput label="Reserve Price" optional value={form.reservePrice} onChange={(v) => update('reservePrice', v)} />
          <CurrencyInput label="Minimum Offer" optional value={form.minimumOffer} onChange={(v) => update('minimumOffer', v)} />
          <CurrencyInput label="Buy Now Price" optional value={form.buyNowPrice} onChange={(v) => update('buyNowPrice', v)} />
        </div>
      </div>

      <Separator />

      <div>
        <FieldLabel optional>Break-Even Analysis</FieldLabel>
        <Textarea
          placeholder="Describe your break-even analysis..."
          value={form.breakEvenAnalysis}
          onChange={(e) => update('breakEvenAnalysis', e.target.value)}
          rows={3}
          className="mt-1 resize-none"
        />
      </div>
    </div>
  );
}

/* ---------- Step: Digital Assets ---------- */

function StepDigitalAssets({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
  const update = (key: keyof FormData, value: string | boolean | string[]) =>
    setForm({ ...form, [key]: value });

  const [techInput, setTechInput] = useState('');

  const addTech = () => {
    const trimmed = techInput.trim();
    if (trimmed && !form.technologyStack.includes(trimmed)) {
      update('technologyStack', [...form.technologyStack, trimmed]);
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    update('technologyStack', form.technologyStack.filter((t) => t !== tech));
  };

  const selectTech = (tech: string) => {
    if (!form.technologyStack.includes(tech)) {
      update('technologyStack', [...form.technologyStack, tech]);
    }
  };

  const availableTech = TECHNOLOGY_STACKS.filter(
    (t) => !form.technologyStack.includes(t)
  );

  return (
    <div className="space-y-5">
      <div>
        <SectionLabel>URLs & Links</SectionLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <FieldLabel>Website URL *</FieldLabel>
            <Input placeholder="https://example.com" value={form.websiteUrl} onChange={(e) => update('websiteUrl', e.target.value)} className="mt-1" />
          </div>
          <div>
            <FieldLabel optional>Demo URL</FieldLabel>
            <Input placeholder="https://demo.example.com" value={form.demoUrl} onChange={(e) => update('demoUrl', e.target.value)} className="mt-1" />
          </div>
          <div>
            <FieldLabel optional>GitHub Repository</FieldLabel>
            <Input placeholder="https://github.com/..." value={form.githubRepo} onChange={(e) => update('githubRepo', e.target.value)} className="mt-1" />
          </div>
          <div>
            <FieldLabel optional>Google Play URL</FieldLabel>
            <Input placeholder="https://play.google.com/..." value={form.googlePlayUrl} onChange={(e) => update('googlePlayUrl', e.target.value)} className="mt-1" />
          </div>
          <div>
            <FieldLabel optional>Apple App Store URL</FieldLabel>
            <Input placeholder="https://apps.apple.com/..." value={form.appleStoreUrl} onChange={(e) => update('appleStoreUrl', e.target.value)} className="mt-1" />
          </div>
          <div>
            <FieldLabel optional>Admin Panel Demo</FieldLabel>
            <Input placeholder="https://admin.example.com" value={form.adminPanelDemo} onChange={(e) => update('adminPanelDemo', e.target.value)} className="mt-1" />
          </div>
          <div>
            <FieldLabel optional>Customer Portal</FieldLabel>
            <Input placeholder="https://portal.example.com" value={form.customerPortalDemo} onChange={(e) => update('customerPortalDemo', e.target.value)} className="mt-1" />
          </div>
          <div>
            <FieldLabel optional>API Documentation</FieldLabel>
            <Input placeholder="https://docs.example.com" value={form.apiDocumentation} onChange={(e) => update('apiDocumentation', e.target.value)} className="mt-1" />
          </div>
        </div>
      </div>

      <Separator />

      {/* Technology Stack Multi-select */}
      <div>
        <SectionLabel>Technology Stack</SectionLabel>
        <div className="mt-2">
          {/* Selected tags */}
          {form.technologyStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {form.technologyStack.map((tech) => (
                <Badge key={tech} variant="secondary" className="gap-1 pr-1">
                  {tech}
                  <button
                    onClick={() => removeTech(tech)}
                    className="ml-0.5 hover:bg-muted rounded-full p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Input to add custom tech */}
          <div className="flex gap-2 mb-3">
            <Input
              placeholder="Type a technology..."
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addTech();
                }
              }}
            />
            <Button type="button" variant="outline" size="sm" onClick={addTech}>
              <Plus className="size-4" />
            </Button>
          </div>

          {/* Quick-select from common tech */}
          {availableTech.length > 0 && (
            <div className="max-h-40 overflow-y-auto rounded-md border p-2 custom-scrollbar">
              <p className="text-[10px] text-muted-foreground mb-1.5 px-1">Quick add:</p>
              <div className="flex flex-wrap gap-1">
                {availableTech.map((tech) => (
                  <button
                    key={tech}
                    onClick={() => selectTech(tech)}
                    className="text-xs px-2 py-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FieldLabel optional>Hosting Provider</FieldLabel>
          <Input placeholder="e.g. AWS, Vercel" value={form.hostingProvider} onChange={(e) => update('hostingProvider', e.target.value)} className="mt-1" />
        </div>
        <div>
          <FieldLabel optional>Cloud Infrastructure</FieldLabel>
          <Input placeholder="e.g. AWS, GCP" value={form.cloudInfrastructure} onChange={(e) => update('cloudInfrastructure', e.target.value)} className="mt-1" />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <FieldLabel>Source Code Available</FieldLabel>
          <p className="text-xs text-muted-foreground mt-0.5">
            Include source code with the project sale
          </p>
        </div>
        <Switch
          checked={form.sourceCodeAvailable}
          onCheckedChange={(v) => update('sourceCodeAvailable', v)}
        />
      </div>
    </div>
  );
}

/* ---------- Step: Metrics ---------- */

function StepMetrics({ form, setForm }: { form: FormData; setForm: (f: FormData) => void }) {
  const update = (key: keyof FormData, value: string) => setForm({ ...form, [key]: value });

  return (
    <div className="space-y-5">
      <div>
        <SectionLabel>Traffic & Users</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          <div>
            <FieldLabel optional>Monthly Visitors</FieldLabel>
            <Input type="number" placeholder="e.g. 50000" value={form.monthlyVisitors} onChange={(e) => update('monthlyVisitors', e.target.value)} className="mt-1" />
          </div>
          <div>
            <FieldLabel optional>Monthly Active Users</FieldLabel>
            <Input type="number" placeholder="e.g. 12000" value={form.monthlyActiveUsers} onChange={(e) => update('monthlyActiveUsers', e.target.value)} className="mt-1" />
          </div>
          <div>
            <FieldLabel optional>Registered Users</FieldLabel>
            <Input type="number" placeholder="e.g. 25000" value={form.registeredUsers} onChange={(e) => update('registeredUsers', e.target.value)} className="mt-1" />
          </div>
          <div>
            <FieldLabel optional>Customers</FieldLabel>
            <Input type="number" placeholder="e.g. 3500" value={form.customers} onChange={(e) => update('customers', e.target.value)} className="mt-1" />
          </div>
          <div>
            <FieldLabel optional>Subscribers</FieldLabel>
            <Input type="number" placeholder="e.g. 1800" value={form.subscribers} onChange={(e) => update('subscribers', e.target.value)} className="mt-1" />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <SectionLabel>Performance</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
          <div>
            <FieldLabel optional>Conversion Rate (%)</FieldLabel>
            <div className="relative mt-1">
              <Input type="number" placeholder="e.g. 3.5" value={form.conversionRate} onChange={(e) => update('conversionRate', e.target.value)} />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
            </div>
          </div>
          <div>
            <FieldLabel optional>SEO Score</FieldLabel>
            <div className="relative mt-1">
              <Input type="number" placeholder="e.g. 85" value={form.seoScore} onChange={(e) => update('seoScore', e.target.value)} />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">/100</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <FieldLabel optional>Traffic Sources</FieldLabel>
        <Textarea
          placeholder="e.g. Organic Search, Direct, Social Media, Referral (comma-separated)"
          value={form.trafficSources}
          onChange={(e) => update('trafficSources', e.target.value)}
          rows={2}
          className="mt-1 resize-none"
        />
        <p className="text-[11px] text-muted-foreground mt-1">Separate each source with a comma</p>
      </div>
    </div>
  );
}

/* ---------- Step: Review ---------- */

function formatCurrency(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return '—';
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num.toLocaleString()}`;
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-2 text-muted-foreground">{title}</h4>
      <div className="rounded-lg border p-4 space-y-2 bg-muted/20">
        {children}
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string | boolean | string[] }) {
  let display: React.ReactNode;
  if (Array.isArray(value)) {
    display = value.length > 0 ? (
      <div className="flex flex-wrap gap-1">
        {value.map((v) => (
          <Badge key={v} variant="secondary" className="text-xs">{v}</Badge>
        ))}
      </div>
    ) : <span className="text-sm text-muted-foreground">—</span>;
  } else if (typeof value === 'boolean') {
    display = (
      <Badge variant={value ? 'default' : 'outline'} className="text-xs">
        {value ? 'Yes' : 'No'}
      </Badge>
    );
  } else {
    display = <span className="text-sm">{value || '—'}</span>;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="text-sm font-medium">{display}</div>
    </div>
  );
}

function StepReview({ form }: { form: FormData }) {
  const catName = CATEGORIES.find((c) => c.slug === form.category)?.name || form.category;
  const stageName = BUSINESS_STAGES.find((s) => s.value === form.businessStage)?.label || form.businessStage;

  return (
    <div className="space-y-5">
      <ReviewSection title="General Information">
        <ReviewRow label="Project Name" value={form.name} />
        <ReviewRow label="Category" value={catName} />
        <ReviewRow label="Industry" value={form.industry} />
        <ReviewRow label="Location" value={form.city ? `${form.city}, ${form.country}` : form.country} />
        <ReviewRow label="Business Stage" value={stageName} />
        <ReviewRow label="Founded Year" value={form.foundedYear} />
        <ReviewRow label="Public Visibility" value={form.visibility} />
      </ReviewSection>

      <ReviewSection title="Description">
        <ReviewRow label="Overview" value={form.overview || '—'} />
        <ReviewRow label="Business Model" value={form.businessModel || '—'} />
        <ReviewRow label="Target Market" value={form.targetMarket || '—'} />
        <ReviewRow label="Revenue Model" value={form.revenueModel || '—'} />
      </ReviewSection>

      <ReviewSection title="Financials">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <ReviewRow label="Annual Revenue" value={formatCurrency(form.annualRevenue)} />
          <ReviewRow label="Net Profit" value={formatCurrency(form.netProfit)} />
          <ReviewRow label="Expected ROI" value={form.expectedROI ? `${form.expectedROI}%` : '—'} />
          <ReviewRow label="Selling Price" value={formatCurrency(form.suggestedSellingPrice)} />
          <ReviewRow label="Buy Now Price" value={formatCurrency(form.buyNowPrice)} />
          <ReviewRow label="Company Valuation" value={formatCurrency(form.companyValuation)} />
        </div>
      </ReviewSection>

      <ReviewSection title="Digital Assets">
        <ReviewRow label="Website" value={form.websiteUrl} />
        <ReviewRow label="Technology Stack" value={form.technologyStack} />
        <ReviewRow label="Source Code" value={form.sourceCodeAvailable} />
      </ReviewSection>

      <ReviewSection title="Business Metrics">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <ReviewRow label="Monthly Visitors" value={form.monthlyVisitors || '—'} />
          <ReviewRow label="MAU" value={form.monthlyActiveUsers || '—'} />
          <ReviewRow label="Conversion Rate" value={form.conversionRate ? `${form.conversionRate}%` : '—'} />
          <ReviewRow label="SEO Score" value={form.seoScore ? `${form.seoScore}/100` : '—'} />
        </div>
      </ReviewSection>
    </div>
  );
}

/* ---------- Main Component ---------- */

export default function ProjectForm() {
  const { goBack } = useAppStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return !!(form.name && form.category && form.country && form.businessStage);
      case 2:
        return !!form.overview && !!form.businessModel && !!form.targetMarket;
      case 3:
        return !!form.annualRevenue && !!form.suggestedSellingPrice;
      case 4:
        return !!form.websiteUrl;
      case 5:
        return true;
      case 6:
        return true;
      default:
        return false;
    }
  }, [currentStep, form]);

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const buildPayload = () => {
    const catObj = CATEGORIES.find((c) => c.slug === form.category);
    const payload: Record<string, unknown> = {
      name: form.name,
      category: form.category,
      categoryName: catObj?.name,
      categoryIcon: catObj?.icon,
      categoryDescription: catObj?.description,
      industry: form.industry || undefined,
      country: form.country,
      city: form.city || undefined,
      businessStage: form.businessStage,
      foundedYear: form.foundedYear ? parseInt(form.foundedYear, 10) : undefined,
      visibility: form.visibility ? 'public' : 'private',
      overview: form.overview,
      businessModel: form.businessModel,
      targetMarket: form.targetMarket,
      revenueModel: form.revenueModel || undefined,
      growthOpportunity: form.growthOpportunity || undefined,
      competitiveAdvantage: form.competitiveAdvantage || undefined,
      businessRisks: form.businessRisks || undefined,
      exitOpportunities: form.exitOpportunities || undefined,
      developmentCost: form.developmentCost ? parseFloat(form.developmentCost) : undefined,
      infrastructureCost: form.infrastructureCost ? parseFloat(form.infrastructureCost) : undefined,
      marketingCost: form.marketingCost ? parseFloat(form.marketingCost) : undefined,
      legalCost: form.legalCost ? parseFloat(form.legalCost) : undefined,
      operationalCost: form.operationalCost ? parseFloat(form.operationalCost) : undefined,
      technologyCost: form.technologyCost ? parseFloat(form.technologyCost) : undefined,
      maintenanceCost: form.maintenanceCost ? parseFloat(form.maintenanceCost) : undefined,
      monthlyRevenue: form.monthlyRevenue ? parseFloat(form.monthlyRevenue) : undefined,
      annualRevenue: form.annualRevenue ? parseFloat(form.annualRevenue) : undefined,
      netProfit: form.netProfit ? parseFloat(form.netProfit) : undefined,
      ebitda: form.ebitda ? parseFloat(form.ebitda) : undefined,
      expectedROI: form.expectedROI ? parseFloat(form.expectedROI) : undefined,
      companyValuation: form.companyValuation ? parseFloat(form.companyValuation) : undefined,
      suggestedSellingPrice: form.suggestedSellingPrice ? parseFloat(form.suggestedSellingPrice) : undefined,
      reservePrice: form.reservePrice ? parseFloat(form.reservePrice) : undefined,
      minimumOffer: form.minimumOffer ? parseFloat(form.minimumOffer) : undefined,
      buyNowPrice: form.buyNowPrice ? parseFloat(form.buyNowPrice) : undefined,
      breakEvenAnalysis: form.breakEvenAnalysis || undefined,
      websiteUrl: form.websiteUrl,
      demoUrl: form.demoUrl || undefined,
      githubRepo: form.githubRepo || undefined,
      googlePlayUrl: form.googlePlayUrl || undefined,
      appleStoreUrl: form.appleStoreUrl || undefined,
      adminPanelDemo: form.adminPanelDemo || undefined,
      customerPortalDemo: form.customerPortalDemo || undefined,
      apiDocumentation: form.apiDocumentation || undefined,
      technologyStack: form.technologyStack.join(', '),
      hostingProvider: form.hostingProvider || undefined,
      cloudInfrastructure: form.cloudInfrastructure || undefined,
      sourceCodeAvailable: form.sourceCodeAvailable,
      monthlyVisitors: form.monthlyVisitors ? parseInt(form.monthlyVisitors, 10) : undefined,
      monthlyActiveUsers: form.monthlyActiveUsers ? parseInt(form.monthlyActiveUsers, 10) : undefined,
      registeredUsers: form.registeredUsers ? parseInt(form.registeredUsers, 10) : undefined,
      customers: form.customers ? parseInt(form.customers, 10) : undefined,
      subscribers: form.subscribers ? parseInt(form.subscribers, 10) : undefined,
      conversionRate: form.conversionRate ? parseFloat(form.conversionRate) : undefined,
      seoScore: form.seoScore ? parseInt(form.seoScore, 10) : undefined,
      trafficSources: form.trafficSources || undefined,
      auctionEnabled: false,
    };
    return payload;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });
      if (res.ok) {
        toast.success('Project created successfully!');
        goBack();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || 'Failed to create project');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAiValuation = async () => {
    setAiLoading(true);
    try {
      const payload = buildPayload();
      const res = await fetch('/api/projects/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.aiValuation) {
          setForm((prev) => ({
            ...prev,
            companyValuation: String(data.aiValuation),
            suggestedSellingPrice: prev.suggestedSellingPrice || String(data.aiValuation),
          }));
          toast.success(`AI Valuation: $${(data.aiValuation / 1_000_000).toFixed(1)}M`);
        }
        if (data.investorPrice) {
          // Could show these in a dialog, for now just toast
          toast.info(`Investor Price: $${(data.investorPrice / 1_000_000).toFixed(1)}M`);
        }
      } else {
        toast.error('AI Valuation failed. Try again.');
      }
    } catch {
      toast.error('AI Valuation service unavailable.');
    } finally {
      setAiLoading(false);
    }
  };

  const currentStepData = STEPS.find((s) => s.id === currentStep)!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 py-6"
    >
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 mb-4 text-muted-foreground hover:text-foreground -ml-2"
        onClick={goBack}
      >
        <ArrowLeft className="size-4" />
        Cancel
      </Button>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">List a New Project</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Fill in the details to list your project on the marketplace
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Connector line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted z-0" />
          <div
            className="absolute top-5 left-0 h-0.5 bg-primary z-0 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          />

          {STEPS.map((step) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <button
                key={step.id}
                onClick={() => {
                  // Allow clicking on completed or current steps
                  if (isCompleted || isActive) setCurrentStep(step.id);
                }}
                className="flex flex-col items-center gap-1.5 relative z-10 group"
                disabled={!isCompleted && !isActive}
              >
                <div
                  className={`size-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    isCompleted
                      ? 'bg-primary border-primary text-primary-foreground'
                      : isActive
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-background border-muted-foreground/30 text-muted-foreground'
                  } ${!isCompleted && !isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {isCompleted ? (
                    <Check className="size-4" />
                  ) : (
                    <StepIcon className="size-4" />
                  )}
                </div>
                <span
                  className={`text-[11px] font-medium hidden sm:block transition-colors ${
                    isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
          <CardDescription>
            {currentStep === 1 && 'Basic information about your project'}
            {currentStep === 2 && 'Describe your business in detail'}
            {currentStep === 3 && 'Financial data and pricing'}
            {currentStep === 4 && 'Links, tech stack, and digital assets'}
            {currentStep === 5 && 'Traffic and performance data'}
            {currentStep === 6 && 'Review your listing before publishing'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {currentStep === 1 && <StepGeneralInfo form={form} setForm={setForm} />}
              {currentStep === 2 && <StepDescription form={form} setForm={setForm} />}
              {currentStep === 3 && <StepFinancials form={form} setForm={setForm} />}
              {currentStep === 4 && <StepDigitalAssets form={form} setForm={setForm} />}
              {currentStep === 5 && <StepMetrics form={form} setForm={setForm} />}
              {currentStep === 6 && <StepReview form={form} />}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <Separator className="my-6" />
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="gap-1.5"
            >
              <ArrowLeft className="size-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentStep === 6 && (
                <Button
                  variant="outline"
                  onClick={handleAiValuation}
                  disabled={aiLoading || submitting}
                  className="gap-1.5 text-violet-600 border-violet-200 hover:bg-violet-50 dark:text-violet-400 dark:border-violet-800 dark:hover:bg-violet-950/30"
                >
                  {aiLoading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Sparkles className="size-4" />
                  )}
                  AI Valuation
                </Button>
              )}

              {currentStep < 6 ? (
                <Button onClick={nextStep} disabled={!canProceed()} className="gap-1.5">
                  Next
                  <ArrowRight className="size-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={submitting} className="gap-1.5">
                  {submitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Check className="size-4" />
                  )}
                  Submit Project
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}