import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/actions/auth/sessions';
import { cookies } from 'next/headers';

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/login', '/signup'];

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);
    // 3. Decrypt the session from the cookie
    const cookie = cookies().get('session')?.value;
    const session = await decrypt(cookie);

    // 4. Redirect to /login if the user is not authenticated
    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // 5. Redirect authenticated users from public routes (excluding home page "/")
    if (isPublicRoute && session?.userId) {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }

    // 6. Allow authenticated users to access the home page ("/")
    if (path === '/' && session?.userId) {
        return NextResponse.next();
    }

    return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
