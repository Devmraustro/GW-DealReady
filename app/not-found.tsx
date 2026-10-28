'use client';
import Link from 'next/link';
import { useMarket } from '@/lib/portugal/i18n';
export default function NotFound() { const { t } = useMarket(); return <div className="gw-container gw-page gw-empty"><h1>{t('notFound')}</h1><Link href="/" className="gw-button gw-button-teal">{t('returnHome')}</Link></div>; }
