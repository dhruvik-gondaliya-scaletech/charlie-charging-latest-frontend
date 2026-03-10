import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_CONFIG, FRONTEND_ROUTES } from './constants/constants';
import { UserRole } from './lib/permissions';

const publicRoutes = [FRONTEND_ROUTES.LOGIN, FRONTEND_ROUTES.REGISTER, FRONTEND_ROUTES.VERIFY_EMAIL, FRONTEND_ROUTES.ACCEPT_INVITE];
const authRoutes = [FRONTEND_ROUTES.LOGIN, FRONTEND_ROUTES.REGISTER];

interface User {
  id: string;
  email: string;
  role: string;
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000;
    return Date.now() >= expirationTime;
  } catch {
    return true;
  }
}

function getUserFromCookie(request: NextRequest): User | null {
  try {
    const userCookie = request.cookies.get(AUTH_CONFIG.userKey)?.value;
    if (!userCookie) return null;
    return JSON.parse(userCookie);
  } catch {
    return null;
  }
}

function hasRoleAccess(userRole: string, path: string): boolean {
  const adminOnlyRoutes = [FRONTEND_ROUTES.TENANTS];
  const isAdminRoute = adminOnlyRoutes.some(route => path.startsWith(route));

  if (isAdminRoute && userRole !== UserRole.ADMIN) {
    return false;
  }

  return true;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(AUTH_CONFIG.tokenKey)?.value;
  const user = getUserFromCookie(request);

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  const isAuthenticated = !!token && !!user && !isTokenExpired(token);

  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL(FRONTEND_ROUTES.DASHBOARD, request.url));
    }
    return NextResponse.redirect(new URL(FRONTEND_ROUTES.LOGIN, request.url));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(FRONTEND_ROUTES.DASHBOARD, request.url));
  }

  if (!isPublicRoute && !isAuthenticated) {
    const loginUrl = new URL(FRONTEND_ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // if (isAuthenticated && user) {
  //   if (!hasRoleAccess(user.role, pathname)) {
  //     return NextResponse.redirect(new URL(FRONTEND_ROUTES.DASHBOARD + '?unauthorized=true', request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
};
