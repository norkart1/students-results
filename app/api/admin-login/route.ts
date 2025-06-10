import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const username = formData.get('username')
  const password = formData.get('password')

  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD

  if (username === adminUsername && password === adminPassword) {
    // Set a session cookie (simple, not secure for production)
    const res = NextResponse.redirect(new URL(request.nextUrl.searchParams.get('redirect') || '/admin', request.url))
    res.cookies.set('admin-auth', '1', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      // secure: true, // enable in production
      maxAge: 60 * 60 * 8, // 8 hours
    })
    return res
  }

  // Invalid login, redirect back with error
  const loginUrl = new URL('/admin/login', request.url)
  loginUrl.searchParams.set('error', '1')
  if (request.nextUrl.searchParams.get('redirect')) {
    loginUrl.searchParams.set('redirect', request.nextUrl.searchParams.get('redirect')!)
  }
  return NextResponse.redirect(loginUrl)
}
