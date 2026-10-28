export type MarketLocale = 'pt' | 'en' | 'fr' | 'ar';
export type Transaction = 'mid' | 'long' | 'sale';
export type PropertyType = 'apartment' | 'villa' | 'townhouse';
export type DealStage = 'inquiry' | 'documents' | 'review' | 'agreement' | 'move-in' | 'complete';
export type DocumentStatus = 'requested' | 'needs_review' | 'accepted' | 'rejected';
export type DocumentKind = 'identity' | 'income' | 'address';
export type Plan = 'free' | 'pro';

export interface MarketProperty {
  id: string;
  slug: string;
  title: string;
  city: string;
  district: string;
  transaction: Transaction;
  type: PropertyType;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  gallery: string[];
  featured: boolean;
  available: string;
  amenities: ('furnished' | 'balcony' | 'parking' | 'workspace' | 'garden' | 'pool')[];
}

export interface DemoDocument {
  id: string;
  kind: DocumentKind;
  required: boolean;
  status: DocumentStatus;
  fileName?: string;
  reviewComment?: string;
}

export interface DemoActivity {
  id: string;
  action: string;
  detail?: string;
  at: string;
  actor: string;
}

export interface DemoDeal {
  id: string;
  clientName: string;
  email: string;
  origin: string;
  language: MarketLocale;
  propertyId: string;
  transaction: Transaction;
  stage: DealStage;
  agent: string;
  arrival: string;
  endDate: string;
  purpose: string;
  nextAction: string;
  documents: DemoDocument[];
  discrepancy: { expected: string; extracted: string; source: string; resolved: boolean } | null;
  lifecycle: {
    contract: 'not_started' | 'in_review' | 'ready';
    checkIn: boolean;
    checkOut: boolean;
    deposit: 'not_recorded' | 'held' | 'returned';
    extensionReminder: boolean;
    maintenance: boolean;
  };
  activities: DemoActivity[];
  createdAt: string;
}

export interface DemoInquiry {
  id: string;
  dealId: string;
  name: string;
  email: string;
  message: string;
  kind: 'inquiry' | 'viewing';
  createdAt: string;
}
