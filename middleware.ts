import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only run for /admin and its subroutes, but allow /admin-login
  if (!request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/admin-login')) {
    return NextResponse.next()
  }

  // Check for a session cookie (e.g., 'admin-auth')
  const cookie = request.cookies.get('admin-auth')
  if (!cookie) {
    // Redirect to custom login page
    const loginUrl = new URL('/admin-login', request.url)
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Optionally, validate the cookie value here (e.g., JWT or signed value)
  // For now, just check presence
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
