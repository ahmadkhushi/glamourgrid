import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

const protectedAdminRoutes = /^\/admin(\/|$)/;
const adminLoginRoute = '/admin/login';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!protectedAdminRoutes.test(pathname)) {
    return NextResponse.next();
  }

  // Allow the login page itself
  if (pathname === adminLoginRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get('gg-session')?.value;
  if (!token) {
    return NextResponse.redirect(new URL(adminLoginRoute, request.url));
  }

  const session = await decrypt(token);
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.redirect(new URL(adminLoginRoute, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
