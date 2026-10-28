'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import type { MarketLocale } from './types';
import { messages, type MessageKey } from './messages';

export function isLegacyPath(path: string): boolean {
  return ['/algeria', '/properties', '/cars', '/map', '/services', '/about', '/contact', '/admin'].some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}
const indices: Record<MarketLocale, number> = { pt: 0, en: 1, fr: 2, ar: 3 };
type Context = { locale: MarketLocale; setLocale: (locale: MarketLocale) => void; t: (key: MessageKey) => string; dir: 'ltr' | 'rtl' };
const MarketContext = createContext<Context | null>(null);
export function MarketProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [locale, setState] = useState<MarketLocale>('pt');
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gwd.locale');
      // Restore the persisted locale after hydration to avoid server/client mismatches.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved === 'pt' || saved === 'en' || saved === 'fr' || saved === 'ar') setState(saved);
    } catch { /* storage is optional */ }
  }, []);
  useEffect(() => {
    if (!isLegacyPath(pathname)) {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale, pathname]);
  const setLocale = useCallback((next: MarketLocale) => {
    setState(next);
    try { localStorage.setItem('gwd.locale', next); } catch { /* storage is optional */ }
  }, []);
  const value = useMemo(() => ({ locale, setLocale, t: (key: MessageKey) => messages[key][indices[locale]], dir: locale === 'ar' ? 'rtl' as const : 'ltr' as const }), [locale, setLocale]);
  return <MarketContext.Provider value={value}>{children}</MarketContext.Provider>;
}
export function useMarket() {
  const value = useContext(MarketContext);
  if (!value) throw new Error('useMarket requires MarketProvider');
  return value;
}
