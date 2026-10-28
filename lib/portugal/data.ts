import type { DemoDeal, MarketProperty, Transaction } from './types';

/** Fictional inventory. The locally generated photographs are illustrations, not photos of actual listings. */
export const marketProperties: MarketProperty[] = [
  { id: 'pt-1', slug: 'apartamento-graca-lisboa', title: 'Apartamento da Graça', city: 'Lisboa', district: 'Graça', transaction: 'mid', type: 'apartment', price: 1850, bedrooms: 2, bathrooms: 2, area: 105, image: '/demo/lisbon-apartment.jpg', gallery: ['/demo/lisbon-apartment.jpg', '/demo/lisbon-graca-detail.jpg'], featured: true, available: '2026-11-15', amenities: ['furnished', 'balcony', 'workspace'] },
  { id: 'pt-2', slug: 'casa-atlantico-cascais', title: 'Casa do Atlântico', city: 'Cascais', district: 'Estoril', transaction: 'sale', type: 'villa', price: 1290000, bedrooms: 4, bathrooms: 3, area: 248, image: '/demo/cascais-villa.jpg', gallery: ['/demo/cascais-villa.jpg', '/demo/cascais-detail.jpg'], featured: true, available: '2026-12-01', amenities: ['garden', 'parking', 'pool'] },
  { id: 'pt-3', slug: 'apartamento-ribeira-porto', title: 'Apartamento da Ribeira', city: 'Porto', district: 'Ribeira', transaction: 'long', type: 'apartment', price: 1450, bedrooms: 2, bathrooms: 1, area: 92, image: '/demo/porto-apartment.jpg', gallery: ['/demo/porto-apartment.jpg'], featured: true, available: '2026-11-01', amenities: ['furnished', 'balcony'] },
  { id: 'pt-4', slug: 'casa-luz-algarve', title: 'Casa da Luz', city: 'Algarve', district: 'Lagos', transaction: 'mid', type: 'townhouse', price: 2200, bedrooms: 3, bathrooms: 2, area: 138, image: '/demo/algarve-home.jpg', gallery: ['/demo/algarve-home.jpg', '/demo/algarve-detail.jpg'], featured: true, available: '2026-12-10', amenities: ['furnished', 'garden', 'workspace'] },
  { id: 'pt-5', slug: 'apartamento-principe-real', title: 'Pátio Príncipe Real', city: 'Lisboa', district: 'Príncipe Real', transaction: 'long', type: 'apartment', price: 2100, bedrooms: 3, bathrooms: 2, area: 124, image: '/demo/principe-real.jpg', gallery: ['/demo/principe-real.jpg'], featured: false, available: '2026-11-20', amenities: ['balcony', 'workspace'] },
  { id: 'pt-6', slug: 'moradia-foz-porto', title: 'Moradia da Foz', city: 'Porto', district: 'Foz do Douro', transaction: 'sale', type: 'villa', price: 875000, bedrooms: 3, bathrooms: 3, area: 201, image: '/demo/foz-villa.jpg', gallery: ['/demo/foz-villa.jpg'], featured: false, available: '2027-01-01', amenities: ['garden', 'parking'] },
];

const documents = (statuses: ['requested' | 'needs_review' | 'accepted' | 'rejected', 'requested' | 'needs_review' | 'accepted' | 'rejected', 'requested' | 'needs_review' | 'accepted' | 'rejected']) => [
  { id: 'identity', kind: 'identity' as const, required: true, status: statuses[0], ...(statuses[0] === 'accepted' ? { fileName: 'sample-identity.pdf' } : {}) },
  { id: 'income', kind: 'income' as const, required: true, status: statuses[1], ...(statuses[1] === 'needs_review' || statuses[1] === 'accepted' ? { fileName: 'sample-income.pdf' } : {}) },
  { id: 'address', kind: 'address' as const, required: true, status: statuses[2], ...(statuses[2] === 'accepted' ? { fileName: 'sample-address.pdf' } : {}) },
];

const makeDeal = (id: string, clientName: string, origin: string, propertyId: string, transaction: Transaction, statuses: Parameters<typeof documents>[0], stage: DemoDeal['stage'], arrival: string): DemoDeal => ({
  id, clientName, email: `${id}@example.test`, origin, language: 'en', propertyId, transaction, stage, agent: 'Sofia Martins', arrival, endDate: '2027-05-31', purpose: 'Relocation', nextAction: 'Document review', documents: documents(statuses),
  discrepancy: id === 'DR-2401' ? { expected: 'Claire Martin', extracted: 'Claire Martine', source: 'sample-identity.pdf · page 1', resolved: false } : null,
  lifecycle: { contract: 'not_started', checkIn: false, checkOut: false, deposit: 'not_recorded', extensionReminder: false, maintenance: false },
  activities: [{ id: `${id}-created`, action: 'deal_created', at: '2026-10-24T10:30:00.000Z', actor: 'Sofia Martins' }],
  createdAt: '2026-10-24T10:30:00.000Z',
});

export const seedDeals: DemoDeal[] = [
  makeDeal('DR-2401', 'Claire Martin', 'France', 'pt-1', 'mid', ['accepted', 'needs_review', 'requested'], 'review', '2026-11-15'),
  makeDeal('DR-2402', 'James Wilson', 'United Kingdom', 'pt-3', 'long', ['accepted', 'accepted', 'accepted'], 'agreement', '2026-12-01'),
  makeDeal('DR-2403', 'Amira Benali', 'Morocco', 'pt-4', 'mid', ['needs_review', 'requested', 'requested'], 'documents', '2026-12-10'),
  makeDeal('DR-2404', 'Lucas Moreau', 'France', 'pt-2', 'sale', ['accepted', 'accepted', 'requested'], 'documents', '2027-01-15'),
  makeDeal('DR-2405', 'Emma Larsen', 'Denmark', 'pt-5', 'long', ['requested', 'requested', 'requested'], 'inquiry', '2027-02-01'),
];
