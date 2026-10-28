import type { Metadata, Viewport } from 'next';
import './globals.css';
import './portugal.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-sans/latin-700.css';
import '@fontsource/playfair-display/latin-500.css';
import '@fontsource/playfair-display/latin-500-italic.css';
import '@fontsource/playfair-display/latin-600.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/noto-sans-arabic/arabic-400.css';
import '@fontsource/noto-sans-arabic/arabic-600.css';
import { Toaster } from 'sonner';
import { I18nProvider } from '@/lib/i18n';
import { DemoStoreProvider } from '@/lib/demo-store';
import { MarketProvider } from '@/lib/portugal/i18n';
import { PortugalDemoProvider } from '@/lib/portugal/store';
import { SiteFrame } from '@/components/portugal/chrome';

export const metadata: Metadata = {
  title: { default: 'GW Immobilier × DealReady | Portugal', template: '%s | GW Immobilier' },
  description: 'Uma demonstração imobiliária para descobrir Portugal e acompanhar cada passo com GW DealReady. Imóveis e dados fictícios.',
  robots: { index: false, follow: false },
  icons: { icon: '/icon.svg' },
};
export const viewport: Viewport = { themeColor: '#173937', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt" dir="ltr" suppressHydrationWarning><body className="min-h-dvh bg-white"><I18nProvider><DemoStoreProvider><MarketProvider><PortugalDemoProvider><a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:z-[100] focus:bg-white focus:p-3">Saltar para o conteúdo · Skip to content</a><SiteFrame>{children}</SiteFrame><Toaster position="top-center" richColors closeButton /></PortugalDemoProvider></MarketProvider></DemoStoreProvider></I18nProvider></body></html>;
}
