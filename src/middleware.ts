import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // CRITICAL: Allow NextAuth API routes (signin, callback, session, etc.)
    if (pathname.startsWith('/api/auth')) {
        return NextResponse.next();
    }

    // Protect all /admin routes except /admin/login
    if (pathname.startsWith('/admin')) {
        // Allow access to login page without authentication
        if (pathname === '/admin/login') {
            return NextResponse.next();
        }

        // Check if user is authenticated
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        });

        // If not authenticated, redirect to admin login
        if (!token) {
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('callbackUrl', pathname);
            return NextResponse.redirect(loginUrl);
        }

        // Check if user has admin role
        if (token.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // Protect admin API routes
    if (pathname.startsWith('/api/admin') ||
        pathname === '/api/upload' ||
        pathname === '/api/sign-cloudinary') {

        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized - Authentication required' },
                { status: 401 }
            );
        }

        if (pathname.startsWith('/api/admin') && token.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Forbidden - Admin access required' },
                { status: 403 }
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/api/admin/:path*',
        '/api/upload',
        '/api/sign-cloudinary',
    ],
};
