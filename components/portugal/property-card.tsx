'use client';
import Link from 'next/link';
import { BedDouble, Bath, Maximize2, ArrowUpRight, Heart, GitCompareArrows, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import type { MarketProperty } from '@/lib/portugal/types';
import { useMarket } from '@/lib/portugal/i18n';
import { usePortugalDemo } from '@/lib/portugal/store';
import { transactionLabelKey } from '@/lib/portugal/logic';

export function formatEuro(value: number, locale = 'pt') { return new Intl.NumberFormat(locale === 'ar' ? 'en-IE' : locale === 'en' ? 'en-IE' : locale === 'fr' ? 'fr-FR' : 'pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value); }
export function PropertyCard({ property }: { property: MarketProperty }) {
  const { t, locale } = useMarket();
  const { favorites, compare, toggleFavorite, toggleCompare } = usePortugalDemo();
  const liked = favorites.includes(property.id), compared = compare.includes(property.id);
  return <article className="gw-property-card">
    <div className="gw-property-image-wrap">
      <Link href={`/homes/${property.slug}`} aria-label={`${t('viewDetails')}: ${property.title}`}><img src={property.image} alt={`${property.title} — ${t('sampleShort')}`} className="gw-property-image" /></Link>
      <span className="gw-property-badge">{t(transactionLabelKey(property.transaction))}</span>
      <button className={`gw-favorite ${liked ? 'is-active' : ''}`} type="button" aria-label={liked ? t('unfavorite') : t('favorite')} aria-pressed={liked} onClick={() => toggleFavorite(property.id)}><Heart size={18} fill={liked ? 'currentColor' : 'none'} /></button>
      <span className="gw-image-caption">{t('sample')}</span>
    </div>
    <div className="gw-property-body"><div className="gw-property-location"><MapPin size={14}/>{property.district}, {property.city}</div>
      <div className="gw-property-title-row"><Link href={`/homes/${property.slug}`}><h3>{property.title}</h3></Link><Link className="gw-card-arrow" href={`/homes/${property.slug}`} aria-label={`${t('viewDetails')}: ${property.title}`}><ArrowUpRight size={18}/></Link></div>
      <div className="gw-property-facts"><span><BedDouble size={16}/>{property.bedrooms} {t('rooms')}</span><span><Bath size={16}/>{property.bathrooms}</span><span><Maximize2 size={15}/>{property.area} m²</span></div>
      <div className="gw-property-bottom"><div><strong>{formatEuro(property.price, locale)}</strong>{property.transaction !== 'sale' && <span> {t('month')}</span>}</div><button type="button" className={`gw-compare-button ${compared ? 'is-active' : ''}`} aria-pressed={compared} onClick={() => { if (!toggleCompare(property.id)) toast.info(`${t('compare')}: max. 3`); }}><GitCompareArrows size={16}/>{compared ? t('compared') : t('compare')}</button></div>
    </div>
  </article>;
}
