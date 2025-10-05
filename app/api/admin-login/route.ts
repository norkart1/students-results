import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const username = formData.get('username')
  const password = formData.get('password')

  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD

  if (username === adminUsername && password === adminPassword) {
    const redirectParam = request.nextUrl.searchParams.get('redirect') || '/admin'
    const redirectUrl = new URL(redirectParam, request.url)
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

  const loginUrl = new URL('/admin-login', request.url)
  loginUrl.searchParams.set('error', '1')
  if (request.nextUrl.searchParams.get('redirect')) {
    loginUrl.searchParams.set('redirect', request.nextUrl.searchParams.get('redirect')!)
  }
  return NextResponse.redirect(loginUrl)
}
