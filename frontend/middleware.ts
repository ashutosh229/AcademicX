import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected
  const isProtectedPath =
    pathname.startsWith('/courses') ||
    pathname.startsWith('/profile') ||
    pathname.startsWith('/profile/edit') ||
    pathname.startsWith('/courses/:id/feedback') ||
    pathname.startsWith('/courses/:id/feedback/show');

  // Skip middleware for non-protected paths
  if (!isProtectedPath) {
    return NextResponse.next();
  }

  // Get the token
  const token = await getToken({ req: request });

  // If no token, redirect to login
  if (!token) {
    const url = new URL('/auth/unauthorized', request.url);
    return NextResponse.redirect(url);
  }

  // For profile paths, check if user is a student
  if (pathname.startsWith('/profile') && token.role !== 'student') {
    const url = new URL('/auth/error', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/courses/:path*',
    '/profile/:path*',
  ],
};