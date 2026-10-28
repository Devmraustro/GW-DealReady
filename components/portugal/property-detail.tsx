'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, ArrowRight, Bath, BedDouble, CalendarDays, Check, GitCompareArrows, Heart, MapPin, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';
import { useMarket } from '@/lib/portugal/i18n';
import { usePortugalDemo } from '@/lib/portugal/store';
import { transactionLabelKey } from '@/lib/portugal/logic';
import { formatEuro, PropertyCard } from './property-card';
import { InquiryForm } from './inquiry';

export function PortugalPropertyDetail({ slug }: { slug: string }) {
  const { t, locale } = useMarket();
  const { properties, favorites, compare, toggleFavorite, toggleCompare, hydrated } = usePortugalDemo();
  const [index, setIndex] = useState(0);
  const p = properties.find((property)=>property.slug === slug);
  if (!p) return <div className="gw-page gw-container gw-empty"><h1>{hydrated ? t('notFound') : '…'}</h1><Link href="/homes" className="gw-button gw-button-teal">{t('explore')}</Link></div>;
  const liked = favorites.includes(p.id), compared = compare.includes(p.id);
  return <div className="gw-page gw-container"><div className="gw-breadcrumb"><Link href="/">{t('home')}</Link><span>/</span><Link href="/homes">{t('navHomes')}</Link><span>/</span>{p.title}</div><div className="gw-detail-heading"><div><div className="gw-eyebrow"><span/> {t('sample')}</div><h1>{p.title}</h1><p><MapPin size={16}/>{p.district}, {p.city} · Portugal</p></div><div className="gw-detail-actions"><button className="gw-icon-text" type="button" aria-pressed={liked} onClick={()=>toggleFavorite(p.id)}><Heart size={17} fill={liked ? 'currentColor' : 'none'}/>{liked ? t('unfavorite') : t('favorite')}</button><button className="gw-icon-text" type="button" aria-pressed={compared} onClick={()=>{if(!toggleCompare(p.id)) toast.info(`${t('compare')}: max. 3`);}}><GitCompareArrows size={17}/>{compared ? t('compared') : t('compare')}</button></div></div>
    <div className="gw-gallery"><img src={p.gallery[index % p.gallery.length]} alt={`${p.title} — ${t('sampleShort')}`} /><span className="gw-gallery-label">{t('sample')} · {index + 1} / {p.gallery.length}</span>{p.gallery.length > 1 && <div className="gw-gallery-controls"><button aria-label={t('galleryPrev')} type="button" onClick={()=>setIndex((index-1+p.gallery.length)%p.gallery.length)}><ArrowLeft size={20}/></button><button aria-label={t('galleryNext')} type="button" onClick={()=>setIndex((index+1)%p.gallery.length)}><ArrowRight size={20}/></button></div>}</div>
    <div className="gw-detail-layout"><div><div className="gw-detail-facts"><span><BedDouble/>{p.bedrooms} {t('rooms')}</span><span><Bath/>{p.bathrooms} {t('baths')}</span><span><Maximize2/>{p.area} m²</span><span><CalendarDays/>{t('availableFrom')} {p.available}</span></div><section className="gw-detail-section"><h2>{t('propertyAbout')}</h2><p>{t('propertyDescription')}</p></section><section className="gw-detail-section"><h2>{t('amenities')}</h2><div className="gw-amenities">{p.amenities.map((a)=><span key={a}><Check size={17}/>{t(a)}</span>)}</div></section><section className="gw-detail-section"><h2>{t('transaction')}</h2><span className="gw-soft-badge">{t(transactionLabelKey(p.transaction))}</span><p>{t('rentalTerms')}</p></section></div><aside><div className="gw-price-card"><span>{t(transactionLabelKey(p.transaction))}</span><div><strong>{formatEuro(p.price,locale)}</strong>{p.transaction !== 'sale' && <small> {t('month')}</small>}</div><p>{t('sample')} · {t('availableFrom')} {p.available}</p><a href="#inquiry" className="gw-button gw-button-teal gw-full">{t('inquire')}</a><a href="#inquiry" className="gw-button gw-button-outline gw-full">{t('viewing')}</a></div><div id="inquiry"><InquiryForm propertyId={p.id}/></div></aside></div>
    <section className="gw-section"><div className="gw-section-heading"><h2>{t('related')}</h2><Link href="/homes" className="gw-text-link">{t('viewAll')}</Link></div><div className="gw-property-grid">{properties.filter((other)=>other.id !== p.id).slice(0,3).map((other)=><PropertyCard key={other.id} property={other}/>)}</div></section>
  </div>;
}
