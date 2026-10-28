import { Suspense } from 'react';
import { DealsList } from '@/components/portugal/workspace';
export default function Page(){return <Suspense fallback={<div>…</div>}><DealsList/></Suspense>;}
