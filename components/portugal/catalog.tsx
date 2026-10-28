'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useMarket } from '@/lib/portugal/i18n';
import { usePortugalDemo } from '@/lib/portugal/store';
import { filterMarketProperties } from '@/lib/portugal/logic';
import { PropertyCard, formatEuro } from './property-card';

export function Catalog() {
  const { t } = useMarket();
  const { properties } = usePortugalDemo();
  const params = useSearchParams();
  const get = (key: string) => params.get(key) ?? '';
  const filtered = filterMarketProperties(properties, { q: get('q'), transaction: get('transaction'), min: get('min'), max: get('max'), type: get('type'), bedrooms: get('bedrooms'), bathrooms: get('bathrooms'), minArea: get('minArea'), maxArea: get('maxArea'), sort: get('sort') });
  const page = Math.max(1, Number.parseInt(get('page') || '1', 10) || 1), perPage = 6, pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageLink = (num: number) => { const query = new URLSearchParams(params.toString()); query.set('page', String(num)); return `/homes?${query.toString()}`; };
  return <div className="gw-page gw-container"><div className="gw-breadcrumb"><Link href="/">{t('home')}</Link><span>/</span>{t('navHomes')}</div><div className="gw-page-heading"><div className="gw-eyebrow"><span/> {t('catalogueEyebrow')}</div><h1>{t('catalogueTitle')}</h1><p>{t('catalogueText')}</p></div>
    <form action="/homes" className="gw-catalog-layout"><aside className="gw-filter-panel"><div className="gw-filter-title"><h2><SlidersHorizontal size={18}/> {t('filters')}</h2><Link href="/homes">{t('clearFilters')}</Link></div>
      <label className="gw-field"><span>{t('location')}</span><input name="q" defaultValue={get('q')} placeholder={t('searchPlaceholder')}/></label>
      <label className="gw-field"><span>{t('transaction')}</span><select name="transaction" defaultValue={get('transaction') || 'all'}><option value="all">{t('all')}</option><option value="mid">{t('midTerm')}</option><option value="long">{t('longTerm')}</option><option value="sale">{t('sale')}</option></select></label>
      <label className="gw-field"><span>{t('propertyType')}</span><select name="type" defaultValue={get('type') || 'all'}><option value="all">{t('all')}</option><option value="apartment">{t('apartment')}</option><option value="villa">{t('villa')}</option><option value="townhouse">{t('townhouse')}</option></select></label>
      <div className="gw-field-row"><label className="gw-field"><span>{t('minPrice')}</span><input type="number" name="min" min="0" defaultValue={get('min')} placeholder="€ 0"/></label><label className="gw-field"><span>{t('maxPrice')}</span><input type="number" name="max" min="0" defaultValue={get('max')} placeholder="€"/></label></div>
      <div className="gw-field-row"><label className="gw-field"><span>{t('bedrooms')}</span><select name="bedrooms" defaultValue={get('bedrooms')}><option value="">{t('all')}</option>{[1,2,3,4].map((v)=><option key={v} value={v}>{v}+</option>)}</select></label><label className="gw-field"><span>{t('bathrooms')}</span><select name="bathrooms" defaultValue={get('bathrooms')}><option value="">{t('all')}</option>{[1,2,3].map((v)=><option key={v} value={v}>{v}+</option>)}</select></label></div>
      <div className="gw-field-row"><label className="gw-field"><span>{t('minArea')}</span><input type="number" name="minArea" min="0" defaultValue={get('minArea')}/></label><label className="gw-field"><span>{t('maxArea')}</span><input type="number" name="maxArea" min="0" defaultValue={get('maxArea')}/></label></div>
      <button type="submit" className="gw-button gw-button-teal gw-full"><Search size={17}/>{t('search')}</button></aside>
      <div className="gw-catalog-results"><div className="gw-result-toolbar"><span><strong>{filtered.length}</strong> {t('results')} · <em>{t('sampleShort')}</em></span><label><span>{t('sort')}</span><select name="sort" defaultValue={get('sort') || 'relevance'} onChange={(event) => event.currentTarget.form?.requestSubmit()}><option value="relevance">{t('relevance')}</option><option value="price_asc">{t('priceAsc')}</option><option value="price_desc">{t('priceDesc')}</option><option value="recent">{t('recent')}</option></select></label></div>
        {filtered.length ? <><div className="gw-property-grid gw-catalog-grid">{filtered.slice((Math.min(page,pages)-1)*perPage, Math.min(page,pages)*perPage).map((p)=><PropertyCard key={p.id} property={p}/>)}</div>{pages > 1 && <nav className="gw-pagination">{Array.from({length: pages},(_,i)=><Link key={i+1} href={pageLink(i+1)} aria-current={page === i+1 ? 'page' : undefined}>{i+1}</Link>)}</nav>}</> : <div className="gw-empty"><Search size={28}/><h2>{t('noResults')}</h2><p>{t('noResultsText')}</p><Link href="/homes" className="gw-button gw-button-outline">{t('clearFilters')}</Link></div>}
      </div>
    </form>
  </div>;
}
export function SavedOrCompare({ mode }: { mode: 'saved' | 'compare' }) {
  const { t, locale } = useMarket();
  const { properties, favorites, compare, toggleCompare } = usePortugalDemo();
  const chosen = properties.filter((p) => (mode === 'saved' ? favorites : compare).includes(p.id));
  return <div className="gw-page gw-container"><div className="gw-breadcrumb"><Link href="/">{t('home')}</Link><span>/</span>{mode === 'saved' ? t('favorites') : t('compare')}</div><div className="gw-page-heading"><div className="gw-eyebrow"><span/> GW IMMOBILIER</div><h1>{mode === 'saved' ? t('favorites') : t('compareTitle')}</h1><p>{t('demoNotice')}</p></div>{!chosen.length ? <div className="gw-empty"><h2>{mode === 'saved' ? t('savedEmpty') : t('compareEmpty')}</h2><Link href="/homes" className="gw-button gw-button-teal">{t('explore')}</Link></div> : mode === 'saved' ? <div className="gw-property-grid">{chosen.map((p)=><PropertyCard key={p.id} property={p}/>)}</div> : <div className="gw-compare-table-wrap"><table className="gw-compare-table"><thead><tr><th>{t('property')}</th>{chosen.map((p)=><th key={p.id}><Link href={`/homes/${p.slug}`}><img src={p.image} alt=""/><strong>{p.title}</strong></Link><button type="button" onClick={()=>toggleCompare(p.id)}>{t('cancel')}</button></th>)}</tr></thead><tbody>{([['location',(p: typeof chosen[number])=>`${p.district}, ${p.city}`],['transaction',(p: typeof chosen[number])=>t(p.transaction === 'mid' ? 'midTerm' : p.transaction === 'long' ? 'longTerm' : 'sale')],['propertyType',(p: typeof chosen[number])=>t(p.type)],['minPrice',(p: typeof chosen[number])=>formatEuro(p.price,locale)],['bedrooms',(p: typeof chosen[number])=>String(p.bedrooms)],['bathrooms',(p: typeof chosen[number])=>String(p.bathrooms)],['area',(p: typeof chosen[number])=>`${p.area} m²`]] as const).map(([label,render])=><tr key={label}><th>{t(label)}</th>{chosen.map((p)=><td key={p.id}>{render(p)}</td>)}</tr>)}</tbody></table></div>}</div>;
}
