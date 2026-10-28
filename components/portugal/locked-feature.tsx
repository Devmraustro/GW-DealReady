'use client';
import Link from 'next/link';
import { ArrowUpRight, LockKeyhole } from 'lucide-react';
import { useMarket } from '@/lib/portugal/i18n';
export function LockedFeature() {
  const {t}=useMarket();
  return <div className="gw-locked"><LockKeyhole size={22}/><h3>{t('lockedTitle')}</h3><p>{t('lockedText')}</p><Link href="/workspace/account" className="gw-button gw-button-outline">{t('changePlan')} <ArrowUpRight size={16}/></Link></div>;
}
