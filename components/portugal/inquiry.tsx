'use client';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useMarket } from '@/lib/portugal/i18n';
import { usePortugalDemo } from '@/lib/portugal/store';
import { validISODate, validateInquiry } from '@/lib/portugal/logic';
import type { MarketLocale } from '@/lib/portugal/types';

export function InquiryForm({ propertyId, initialKind = 'inquiry' }: { propertyId?: string; initialKind?: 'inquiry' | 'viewing' }) {
  const { t, locale } = useMarket();
  const { properties, createInquiry } = usePortugalDemo();
  const [done, setDone] = useState('');
  const [error, setError] = useState<'fields' | 'dates' | ''>('');
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input = { name: String(form.get('name') || ''), email: String(form.get('email') || ''), origin: String(form.get('origin') || ''), arrival: String(form.get('arrival') || ''), endDate: String(form.get('endDate') || ''), message: String(form.get('message') || ''), purpose: String(form.get('purpose') || ''), propertyId: propertyId || String(form.get('propertyId') || ''), kind: form.get('kind') === 'viewing' ? 'viewing' as const : 'inquiry' as const, language: String(form.get('language') || locale) as MarketLocale };
    const property = properties.find((p) => p.id === input.propertyId);
    if (!property || !validateInquiry(input)) { setError('fields'); return; }
    if (input.endDate && (!validISODate(input.endDate) || input.endDate <= input.arrival)) { setError('dates'); return; }
    setError('');
    setDone(createInquiry({ ...input, transaction: property.transaction }));
  }
  if (done) return <div className="gw-form-success" role="status"><CheckCircle2 size={32}/><h3>{t('inquirySuccess')}</h3><p>{t('demoWarning')}</p><Link className="gw-button gw-button-dark" href={`/workspace/deals/${encodeURIComponent(done)}`}>{t('openDeal')} <ArrowUpRight size={16}/></Link><button type="button" onClick={()=>setDone('')} className="gw-text-link">{t('newDeal')}</button></div>;
  return <form className="gw-inquiry-form" onSubmit={submit} noValidate><h3>{t('formTitle')}</h3><p>{t('formText')}</p><div className="gw-warning-small">{t('demoWarning')}</div>
    {!propertyId && <label className="gw-field"><span>{t('selectProperty')} *</span><select required name="propertyId" defaultValue=""><option value="">{t('selectProperty')}</option>{properties.map((p)=><option key={p.id} value={p.id}>{p.title} · {p.city}</option>)}</select></label>}
    <div className="gw-field-row"><label className="gw-field"><span>{t('fullName')} *</span><input name="name" required minLength={2} maxLength={100} placeholder="Alex Demo"/></label><label className="gw-field"><span>{t('email')} *</span><input name="email" required type="email" maxLength={120} placeholder="alex@example.test"/></label></div>
    <div className="gw-field-row"><label className="gw-field"><span>{t('origin')} *</span><input name="origin" required minLength={2} maxLength={80} placeholder="France"/></label><label className="gw-field"><span>{t('arrival')} *</span><input name="arrival" required type="date"/></label></div>
    <div className="gw-field-row"><label className="gw-field"><span>{t('endLabel')}</span><input name="endDate" type="date"/></label><label className="gw-field"><span>{t('preferredLanguage')}</span><select name="language" defaultValue={locale}><option value="pt">Português</option><option value="en">English</option><option value="fr">Français</option><option value="ar">العربية</option></select></label></div>
    <label className="gw-field"><span>{t('purpose')}</span><input name="purpose" maxLength={120}/></label>
    <label className="gw-field"><span>{t('requestType')}</span><select name="kind" defaultValue={initialKind}><option value="inquiry">{t('inquire')}</option><option value="viewing">{t('viewing')}</option></select></label>
    <label className="gw-field"><span>{t('message')}</span><textarea name="message" maxLength={1000} rows={3}/></label>{error && <p className="gw-form-error" role="alert">{t(error === 'dates' ? 'invalidDates' : 'requiredFields')}</p>}<button className="gw-button gw-button-teal gw-full" type="submit">{t('submitInquiry')} <ArrowUpRight size={16}/></button>
  </form>;
}
