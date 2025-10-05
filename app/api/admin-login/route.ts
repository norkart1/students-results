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
    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host
    const protocol = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol
    const baseUrl = `${protocol}//${host}`
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

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || request.nextUrl.host
  const protocol = request.headers.get('x-forwarded-proto') || request.nextUrl.protocol
  const baseUrl = `${protocol}//${host}`
  const loginUrl = new URL('/admin-login', baseUrl)
  loginUrl.searchParams.set('error', '1')
  if (request.nextUrl.searchParams.get('redirect')) {
    loginUrl.searchParams.set('redirect', request.nextUrl.searchParams.get('redirect')!)
  }
  return NextResponse.redirect(loginUrl)
}
