import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from '@/lib/admin-session';
import { marketProperties } from '@/lib/portugal/data';

const publicAdminEndpoints = new Set([
  '/admin/login',
  '/api/admin/login',
  '/api/admin/logout',
]);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  // The App Router root loading boundary can stream a 200 before notFound().
  // Resolve known demo slugs here so unknown listing refreshes return a true 404.
  if (pathname === '/homes') return NextResponse.next();
  if (pathname.startsWith('/homes/')) {
    const slug = pathname.slice('/homes/'.length).replace(/\/$/, '');
    if (slug && !marketProperties.some((property) => property.slug === slug) && !/^sample-\d+$/.test(slug)) {
      return new NextResponse('<!doctype html><html lang="pt"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Imóvel não encontrado | GW Immobilier</title></head><body style="font-family:system-ui,sans-serif;background:#f5f8f5;color:#173332;padding:12vh 8vw"><p>GW IMMOBILIER · DEMO</p><h1>Não encontramos este imóvel.</h1><p>This sample property could not be found.</p><a style="color:#24776b" href="/homes">Explorar imóveis · Explore properties →</a></body></html>', { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
    }
    return NextResponse.next();
  }
  if (publicAdminEndpoints.has(pathname)) return NextResponse.next();

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifyAdminSessionToken(token);
  if (session) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'private, no-store, max-age=0');
    return response;
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json(
      { error: 'UNAUTHENTICATED', message: 'Administrator sign-in is required.' },
      { status: 401, headers: { 'Cache-Control': 'no-store, max-age=0' } },
    );
  }

  const loginUrl = new URL('/admin/login', request.url);
  const requestedPath = pathname + request.nextUrl.search;
  if (requestedPath.startsWith('/admin/') && !requestedPath.startsWith('//')) {
    loginUrl.searchParams.set('next', requestedPath);
  }
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/homes/:path*'],
};
