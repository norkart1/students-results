import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const username = formData.get('username')
  const password = formData.get('password')

  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD

  if (username === adminUsername && password === adminPassword) {
    // Use NEXTAUTH_URL or fallback to request origin for redirect
    const redirectParam = request.nextUrl.searchParams.get('redirect') || '/admin'
    const baseUrl = process.env.NEXTAUTH_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`
    const redirectUrl = new URL(redirectParam, baseUrl)
    const res = NextResponse.redirect(redirectUrl)
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
  const loginUrl = new URL('/admin/login', process.env.NEXTAUTH_URL || request.url)
  loginUrl.searchParams.set('error', '1')
  if (request.nextUrl.searchParams.get('redirect')) {
    loginUrl.searchParams.set('redirect', request.nextUrl.searchParams.get('redirect')!)
  }
  return NextResponse.redirect(loginUrl)
}
