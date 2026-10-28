import type { DemoDeal, DemoDocument, MarketProperty, Transaction } from './types';

export interface ReadinessRule { id: string; label: string; complete: boolean }

/** Every rule is equally weighted. This is operational completeness, never legal or identity verification. */
export function readinessRules(deal: DemoDeal): ReadinessRule[] {
  return [
    { id: 'profile', label: 'ruleProfile', complete: Boolean(deal.clientName.trim() && deal.email.trim() && deal.origin.trim()) },
    { id: 'property', label: 'ruleProperty', complete: Boolean(deal.propertyId && deal.arrival) },
    ...deal.documents.filter((doc) => doc.required).map((doc) => ({ id: doc.id, label: doc.kind, complete: doc.status === 'accepted' })),
    { id: 'discrepancy', label: 'ruleDiscrepancy', complete: !deal.discrepancy || deal.discrepancy.resolved },
  ];
}
export function readiness(deal: DemoDeal): number {
  const rules = readinessRules(deal);
  return rules.length ? Math.round((rules.filter((rule) => rule.complete).length / rules.length) * 100) : 0;
}

export function validateDemoFile(file: Pick<File, 'type' | 'size' | 'name'>): string | null {
  if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) return 'invalidFileType';
  if (file.size <= 0 || file.size > 5 * 1024 * 1024) return 'invalidFileSize';
  if (!file.name.trim()) return 'invalidFileType';
  return null;
}

export interface PropertyFilters { q?: string; transaction?: string; min?: string; max?: string; type?: string; bedrooms?: string; bathrooms?: string; minArea?: string; maxArea?: string; sort?: string }
export function filterMarketProperties(properties: MarketProperty[], filters: PropertyFilters): MarketProperty[] {
  const q = filters.q?.trim().toLocaleLowerCase() ?? '';
  const numeric = (s?: string) => s && Number.isFinite(Number(s)) ? Number(s) : undefined;
  const min = numeric(filters.min), max = numeric(filters.max), minArea = numeric(filters.minArea), maxArea = numeric(filters.maxArea);
  const bedrooms = numeric(filters.bedrooms), bathrooms = numeric(filters.bathrooms);
  const matches = properties.filter((p) =>
    (!q || `${p.title} ${p.city} ${p.district} ${p.type}`.toLocaleLowerCase().includes(q)) &&
    (!filters.transaction || filters.transaction === 'all' || p.transaction === filters.transaction) &&
    (!filters.type || filters.type === 'all' || p.type === filters.type) &&
    (min === undefined || p.price >= min) && (max === undefined || p.price <= max) &&
    (minArea === undefined || p.area >= minArea) && (maxArea === undefined || p.area <= maxArea) &&
    (bedrooms === undefined || p.bedrooms >= bedrooms) && (bathrooms === undefined || p.bathrooms >= bathrooms),
  );
  if (filters.sort === 'price_asc') return [...matches].sort((a, b) => a.price - b.price);
  if (filters.sort === 'price_desc') return [...matches].sort((a, b) => b.price - a.price);
  if (filters.sort === 'recent') return [...matches].sort((a, b) => b.available.localeCompare(a.available));
  return matches;
}
export function validISODate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function validateInquiry(input: { name: string; email: string; origin: string; arrival: string; propertyId: string }): boolean {
  return input.name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) && input.origin.trim().length >= 2 && validISODate(input.arrival) && Boolean(input.propertyId);
}
export function defaultDocuments(): DemoDocument[] {
  return (['identity', 'income', 'address'] as const).map((kind) => ({ id: kind, kind, required: true, status: 'requested' }));
}
export function transactionLabelKey(transaction: Transaction): 'midTerm' | 'longTerm' | 'sale' {
  return transaction === 'mid' ? 'midTerm' : transaction === 'long' ? 'longTerm' : 'sale';
}
export function toCSV(rows: string[][]): string {
  return rows.map((row) => row.map((cell) => { const safe = /^[\s]*[=+@-]/.test(cell) ? `'${cell}` : cell; return `"${safe.replace(/"/g, '""')}"`; }).join(',')).join('\r\n');
}
