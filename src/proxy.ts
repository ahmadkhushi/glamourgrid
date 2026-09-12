import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/session';

const protectedAdminRoutes = /^\/admin(\/|$)/;
const adminLoginRoute = '/admin/login';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle CORS for /api routes
  if (pathname.startsWith('/api/')) {
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
  }

  // Handle Admin routes authorization
  if (protectedAdminRoutes.test(pathname)) {
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
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*', '/admin/:path*'],
};

