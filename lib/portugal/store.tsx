'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { marketProperties, seedDeals } from './data';
import { defaultDocuments, validISODate, validateInquiry } from './logic';
import type { DemoActivity, DemoDeal, DemoInquiry, DocumentStatus, MarketLocale, MarketProperty, Plan, Transaction } from './types';

type State = { version: 1; deals: DemoDeal[]; inquiries: DemoInquiry[]; properties: MarketProperty[]; favorites: string[]; compare: string[]; plan: Plan };
const STORAGE = 'gw-dealready.demo.v1';
const initialState = (): State => ({ version: 1, deals: structuredClone(seedDeals), inquiries: [], properties: structuredClone(marketProperties), favorites: [], compare: [], plan: 'pro' });
const makeId = () => typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const event = (action: string, detail?: string): DemoActivity => ({ id: makeId(), action, detail, at: new Date().toISOString(), actor: 'Demo agent' });
export type InquiryInput = { name: string; email: string; origin: string; language: MarketLocale; arrival: string; endDate: string; message: string; purpose: string; kind: 'inquiry' | 'viewing'; propertyId: string; transaction: Transaction };

type DemoContext = State & {
  hydrated: boolean;
  toggleFavorite: (id: string) => void;
  toggleCompare: (id: string) => boolean;
  createInquiry: (input: InquiryInput) => string;
  reviewDocument: (dealId: string, docId: string, status: Extract<DocumentStatus, 'accepted' | 'rejected'>, comment: string) => void;
  simulateUpload: (dealId: string, docId: string, fileName: string) => void;
  resolveDiscrepancy: (dealId: string) => void;
  changeStage: (dealId: string, stage: DemoDeal['stage']) => void;
  updateProfile: (dealId: string, input: Pick<DemoDeal, 'clientName' | 'email' | 'origin' | 'language' | 'arrival' | 'endDate' | 'purpose'>) => boolean;
  changeLifecycle: (dealId: string, patch: Partial<DemoDeal['lifecycle']>, detail: string) => void;
  setPlan: (plan: Plan) => void;
  addProperty: (property: MarketProperty) => void;
  editProperty: (id: string, patch: Partial<MarketProperty>) => void;
  resetDemo: () => void;
};
const DemoContext = createContext<DemoContext | null>(null);
export function PortugalDemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        // Hydrate local demonstration state after the initial server render.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (parsed.version === 1 && Array.isArray(parsed.deals) && Array.isArray(parsed.inquiries) && Array.isArray(parsed.properties) && Array.isArray(parsed.favorites) && Array.isArray(parsed.compare) && (parsed.plan === 'free' || parsed.plan === 'pro')) setState(parsed as State);
      }
    } catch { /* malformed or unavailable storage: use clean synthetic seed */ }
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE, JSON.stringify(state)); } catch { /* local persistence is best-effort */ }
  }, [state, hydrated]);

  const toggleFavorite = useCallback((id: string) => setState((current) => ({ ...current, favorites: current.favorites.includes(id) ? current.favorites.filter((value) => value !== id) : [...current.favorites, id] })), []);
  const toggleCompare = useCallback((id: string) => {
    const canAdd = state.compare.includes(id) || state.compare.length < 3;
    if (!canAdd) return false;
    setState((current) => ({ ...current, compare: current.compare.includes(id) ? current.compare.filter((value) => value !== id) : current.compare.length < 3 ? [...current.compare, id] : current.compare }));
    return true;
  }, [state.compare]);
  const createInquiry = useCallback((input: InquiryInput) => {
    const id = `DR-${makeId().slice(0, 8).toUpperCase()}`;
    const now = new Date().toISOString();
    const deal: DemoDeal = { id, clientName: input.name.trim().slice(0, 100), email: input.email.trim().slice(0, 120), origin: input.origin.trim().slice(0, 80), language: input.language, propertyId: input.propertyId, transaction: input.transaction, stage: 'inquiry', agent: 'Demo agent', arrival: input.arrival, endDate: input.endDate, purpose: input.purpose.trim().slice(0, 120), nextAction: 'Document review', documents: defaultDocuments(), discrepancy: null, lifecycle: { contract: 'not_started', checkIn: false, checkOut: false, deposit: 'not_recorded', extensionReminder: false, maintenance: false }, activities: [event('inquiry_created', input.kind)], createdAt: now };
    const inquiry: DemoInquiry = { id: makeId(), dealId: id, name: deal.clientName, email: deal.email, message: input.message.trim().slice(0, 1000), kind: input.kind, createdAt: now };
    setState((current) => ({ ...current, deals: [deal, ...current.deals], inquiries: [inquiry, ...current.inquiries] }));
    return id;
  }, []);
  const updateDeal = useCallback((id: string, update: (deal: DemoDeal) => DemoDeal) => setState((current) => ({ ...current, deals: current.deals.map((deal) => deal.id === id ? update(deal) : deal) })), []);
  const simulateUpload = useCallback((dealId: string, docId: string, fileName: string) => {
    const newEvent = event('document_uploaded', docId);
    updateDeal(dealId, (deal) => ({ ...deal, documents: deal.documents.map((doc) => doc.id === docId ? { ...doc, status: 'needs_review', fileName: fileName.replace(/[\r\n]/g, '').slice(0, 100), reviewComment: '' } : doc), activities: [newEvent, ...deal.activities] }));
  }, [updateDeal]);
  const reviewDocument = useCallback((dealId: string, docId: string, status: 'accepted' | 'rejected', comment: string) => {
    const newEvent = event('document_reviewed', `${docId}: ${status}${comment.trim() ? ` · ${comment.trim().slice(0, 200)}` : ''}`);
    updateDeal(dealId, (deal) => ({ ...deal, documents: deal.documents.map((doc) => doc.id === docId && doc.status === 'needs_review' ? { ...doc, status, reviewComment: comment.trim().slice(0, 200) } : doc), activities: deal.documents.some((doc) => doc.id === docId && doc.status === 'needs_review') ? [newEvent, ...deal.activities] : deal.activities }));
  }, [updateDeal]);
  const resolveDiscrepancy = useCallback((dealId: string) => {
    const newEvent = event('discrepancy_reviewed');
    updateDeal(dealId, (deal) => deal.discrepancy && !deal.discrepancy.resolved ? { ...deal, discrepancy: { ...deal.discrepancy, resolved: true }, activities: [newEvent, ...deal.activities] } : deal);
  }, [updateDeal]);
  const updateProfile = useCallback((dealId: string, input: Pick<DemoDeal, 'clientName' | 'email' | 'origin' | 'language' | 'arrival' | 'endDate' | 'purpose'>) => {
    const existing = state.deals.find((deal) => deal.id === dealId);
    if (!existing || !validateInquiry({ name: input.clientName, email: input.email, origin: input.origin, arrival: input.arrival, propertyId: existing.propertyId }) || (input.endDate && (!validISODate(input.endDate) || input.endDate <= input.arrival)) || !['pt','en','fr','ar'].includes(input.language)) return false;
    const newEvent = event('profile_updated');
    updateDeal(dealId, (deal) => ({ ...deal, clientName: input.clientName.trim().slice(0,100), email: input.email.trim().slice(0,120), origin: input.origin.trim().slice(0,80), language: input.language, arrival: input.arrival, endDate: input.endDate, purpose: input.purpose.trim().slice(0,120), discrepancy: deal.discrepancy && input.clientName.trim() !== deal.clientName ? { ...deal.discrepancy, expected: input.clientName.trim().slice(0,100), resolved: false } : deal.discrepancy, activities: [newEvent, ...deal.activities] }));
    return true;
  }, [state.deals, updateDeal]);
  const changeStage = useCallback((dealId: string, stage: DemoDeal['stage']) => {
    const newEvent = event('stage_changed', stage);
    updateDeal(dealId, (deal) => ({ ...deal, stage, activities: [newEvent, ...deal.activities] }));
  }, [updateDeal]);
  const changeLifecycle = useCallback((dealId: string, patch: Partial<DemoDeal['lifecycle']>, detail: string) => {
    const newEvent = event('lifecycle_updated', detail);
    updateDeal(dealId, (deal) => ({ ...deal, lifecycle: { ...deal.lifecycle, ...patch }, activities: [newEvent, ...deal.activities] }));
  }, [updateDeal]);
  const setPlan = useCallback((plan: Plan) => setState((current) => ({ ...current, plan })), []);
  const addProperty = useCallback((property: MarketProperty) => setState((current) => ({ ...current, properties: [property, ...current.properties] })), []);
  const editProperty = useCallback((id: string, patch: Partial<MarketProperty>) => setState((current) => ({ ...current, properties: current.properties.map((property) => property.id === id ? { ...property, ...patch, id: property.id, slug: property.slug } : property) })), []);
  const resetDemo = useCallback(() => setState(initialState()), []);
  const value = useMemo(() => ({ ...state, hydrated, toggleFavorite, toggleCompare, createInquiry, reviewDocument, simulateUpload, resolveDiscrepancy, changeStage, updateProfile, changeLifecycle, setPlan, addProperty, editProperty, resetDemo }), [state, hydrated, toggleFavorite, toggleCompare, createInquiry, reviewDocument, simulateUpload, resolveDiscrepancy, changeStage, updateProfile, changeLifecycle, setPlan, addProperty, editProperty, resetDemo]);
  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}
export function usePortugalDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error('usePortugalDemo requires PortugalDemoProvider');
  return context;
}
