import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { marketProperties } from '@/lib/portugal/data';
import { PortugalPropertyDetail } from '@/components/portugal/property-detail';
export async function generateMetadata({ params }: { params: Promise<{slug:string}> }): Promise<Metadata> { const { slug } = await params; const p = marketProperties.find((item)=>item.slug === slug); return { title: p ? `${p.title} · ${p.city} (demo)` : 'Imóvel de demonstração', description: p ? `Imóvel fictício em ${p.city}, Portugal. Demonstração GW Immobilier.` : 'Imóvel de demonstração.' }; }
export default async function HomeDetail({ params }: { params: Promise<{slug:string}> }) { const { slug } = await params; if (!marketProperties.some((item)=>item.slug === slug) && !slug.startsWith('sample-')) notFound(); return <PortugalPropertyDetail slug={slug}/>; }
