import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';



export async function proxy(req: NextRequest) {
    // Retrieve token from cookies
    const token = (await cookies()).get('user_token')?.value;
    
    // If token is present or the route is public, proceed with the request
    if ( token && req.nextUrl.pathname === '/login') {
        return NextResponse.redirect(new URL('/maintenance-events', req.url));
    }

    // If the request is to a protected route and no token is present, return unauthorized
    if (req.nextUrl.pathname !== '/login' && !token) {
        // NextResponse.redirect(new URL('/api/auth/login', req.url));
        return NextResponse.redirect(new URL('/login', req.url));
    } 



        
}

export const config = {
    matcher: ['/', '/api/maintenance_events', '/maintenance', '/maintenance-events', '/login',],
};

