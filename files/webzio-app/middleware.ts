import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Check if it's an admin route (but not the login page)
    if (path.startsWith('/admin') && path !== '/admin/login') {
        // Get token from cookies
        const token = request.cookies.get('token')?.value || ''

        // If no token, redirect to admin login
        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        // Note: For production, you should verify the JWT token here
        // and check if the user has admin/superadmin role
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*']
}
