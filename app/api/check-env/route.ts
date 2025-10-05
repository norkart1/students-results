import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasUsername: !!process.env.ADMIN_USERNAME,
    hasPassword: !!process.env.ADMIN_PASSWORD,
    usernameLength: process.env.ADMIN_USERNAME?.length || 0,
    passwordLength: process.env.ADMIN_PASSWORD?.length || 0,
  })
}
