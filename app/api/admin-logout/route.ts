import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  // Remove the session cookie
  const res = NextResponse.redirect(new URL('/', request.url))
  res.cookies.set('admin-auth', '', { path: '/', maxAge: 0 })
  return res
}
