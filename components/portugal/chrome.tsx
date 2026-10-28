'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, GitCompareArrows, Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useMarket, isLegacyPath } from '@/lib/portugal/i18n';
import { usePortugalDemo } from '@/lib/portugal/store';
import type { MarketLocale } from '@/lib/portugal/types';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { useI18n } from '@/lib/i18n';

export function Brand({ inverted = false }: { inverted?: boolean }) {
  const { t } = useMarket();
  return <Link href="/" className={`gw-brand ${inverted ? 'gw-brand-inverted' : ''}`} aria-label="GW Immobilier — home">
    <span className="gw-brand-mark">GW<span>.</span></span>
    <span className="gw-brand-words"><strong>GW IMMOBILIER</strong><small>{t('brandLine')}</small></span>
  </Link>;
}
export function LanguageSelect({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useMarket();
  return <label className={`gw-language ${compact ? 'gw-language-compact' : ''}`}><span className="sr-only">Language / Idioma</span><select value={locale} onChange={(e) => setLocale(e.target.value as MarketLocale)} aria-label="Language / Idioma"><option value="pt">PT</option><option value="en">EN</option><option value="fr">FR</option><option value="ar">العربية</option></select></label>;
}
export function MarketHeader() {
  const { t } = useMarket();
  const { favorites, compare } = usePortugalDemo();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const nav = [
    { href: '/homes', label: t('navHomes') },
    { href: '/#como-funciona', label: t('navHow') },
    { href: '/dealready', label: t('navDeal') },
    { href: '/plans', label: t('navPlans') },
  ];
  return <>
    <div className="gw-announcement"><span className="gw-announcement-dot" />{t('demoNotice')}</div>
    <header className="gw-header">
      <div className="gw-container gw-header-inner">
        <Brand />
        <nav className="gw-desktop-nav" aria-label="Main navigation">{nav.map((item) => <Link className={pathname === item.href ? 'active' : ''} key={item.href} href={item.href}>{item.label}</Link>)}</nav>
        <div className="gw-header-actions">
          <Link href="/saved" className="gw-header-icon" aria-label={`${t('favorites')} (${favorites.length})`}><Heart size={19} />{favorites.length > 0 && <span>{favorites.length}</span>}</Link>
          <Link href="/compare" className="gw-header-icon gw-compare-icon" aria-label={`${t('compare')} (${compare.length})`}><GitCompareArrows size={19} />{compare.length > 0 && <span>{compare.length}</span>}</Link>
          <LanguageSelect />
          <Link href="/workspace" className="gw-button gw-button-dark gw-header-cta">{t('navWorkspace')} <ArrowUpRight size={16} /></Link>
          <button className="gw-menu-button" type="button" aria-label={open ? t('close') : t('openMenu')} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && <nav className="gw-mobile-nav" aria-label="Mobile navigation">{nav.map((item) => <Link onClick={() => setOpen(false)} key={item.href} href={item.href}>{item.label}<ArrowUpRight size={17}/></Link>)}<Link onClick={() => setOpen(false)} href="/saved">{t('favorites')}</Link><Link onClick={() => setOpen(false)} href="/compare">{t('compare')}</Link><Link onClick={() => setOpen(false)} href="/workspace">{t('navWorkspace')}</Link><Link onClick={() => setOpen(false)} href="/algeria">{t('navAlgeria')}</Link><LanguageSelect /></nav>}
    </header>
  </>;
}
export function MarketFooter() {
  const { t } = useMarket();
  return <footer className="gw-footer"><div className="gw-container"><div className="gw-footer-main">
    <div className="gw-footer-about"><Brand inverted /><p>{t('footerText')}</p><span>PORTUGAL · ALGÉRIE</span></div>
    <div><h3>{t('footerExplore')}</h3><Link href="/homes">{t('navHomes')}</Link><Link href="/dealready">DealReady</Link><Link href="/plans">{t('navPlans')}</Link><Link href="/algeria">{t('navAlgeria')}</Link></div>
    <div><h3>{t('footerInfo')}</h3><Link href="/trust">{t('trust')}</Link><Link href="/privacy">{t('privacy')}</Link><Link href="/terms">{t('terms')}</Link><Link href="/contact-us">{t('navContact')}</Link></div>
    <div className="gw-footer-note"><span>GW DEALREADY</span><p>{t('demoWarning')}</p><Link href="/workspace">{t('openDemo')} <ArrowUpRight size={16}/></Link></div>
  </div><div className="gw-footer-bottom"><span>© 2026 GW IMMOBILIER</span><span>{t('rights')}</span><LanguageSelect compact /></div></div></footer>;
}
export function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { hydrated } = usePortugalDemo();
  const { locale } = useI18n();
  const legacy = isLegacyPath(pathname);
  if (legacy) return <><div role="status" style={{background:'#173b36',color:'#fff',textAlign:'center',padding:'7px 16px',fontSize:12}}>{locale === 'ar' ? 'عرض تجريبي: العقارات والبيانات خيالية. لا تُدخل معلومات شخصية حقيقية.' : 'Démonstration : biens et données fictifs. Ne saisissez aucune information personnelle réelle.'}</div><SiteHeader /><main id="main" className="min-h-[60vh]">{children}</main><SiteFooter /></>;
  const workspace = pathname === '/workspace' || pathname.startsWith('/workspace/');
  return <div data-demo-ready={hydrated ? 'true' : 'false'} aria-busy={!hydrated} className={`market ${workspace ? 'gw-workspace-root' : ''}`}>{!workspace && <MarketHeader />}<main id="main">{children}</main>{!workspace && <MarketFooter />}</div>;
}
