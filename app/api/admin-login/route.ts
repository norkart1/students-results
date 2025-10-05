import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const username = body.username
  const password = body.password

  const adminUsername = process.env.ADMIN_USERNAME
  const adminPassword = process.env.ADMIN_PASSWORD

  if (username === adminUsername && password === adminPassword) {
    const res = NextResponse.json({ success: true })
    res.cookies.set('admin-auth', '1', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
    })
    return res
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}
