import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import Admin from '@/models/Admin'
import dbConnect from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const body = await request.json()
    const username = body.username
    const password = body.password

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 })
    }

    // Find admin by username
    const admin = await Admin.findOne({ username })
    
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify password with bcrypt
    const isValidPassword = await bcrypt.compare(password, admin.password)
    
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Set session cookie
    const res = NextResponse.json({ 
      success: true,
      user: {
        username: admin.username,
        role: admin.role
      }
    })
    
    res.cookies.set('admin-auth', '1', {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 8,
    })
    
    return res
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
