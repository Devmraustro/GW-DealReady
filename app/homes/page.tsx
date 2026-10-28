import { Suspense } from 'react';
import { Catalog } from '@/components/portugal/catalog';
export default function HomesPage() { return <Suspense fallback={<div className="market gw-page gw-container">…</div>}><Catalog/></Suspense>; }
