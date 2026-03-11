import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes (except login)
  if (
    (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) &&
    !pathname.startsWith('/admin/login') &&
    !pathname.startsWith('/api/admin/login')
  ) {
    const session = request.cookies.get('admin_session');
    if (!session || session.value !== 'authenticated') {
      // Return JSON 401 for API routes
      if (pathname.startsWith('/api/')) {
        return NextResponse.json(
          { success: false, error: 'Non autorizzato' },
          { status: 401 }
        );
      }
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect /admin to /admin/dashboard
  if (pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/dashboard',
    '/admin/vouchers',
    '/admin/vouchers/new',
    '/admin/redeem/:path*',
    '/api/admin/vouchers/:path*',
    '/api/admin/verify',
    '/api/admin/stats',
    '/api/admin/redeem',
    '/api/admin/init-db',
  ],
};
