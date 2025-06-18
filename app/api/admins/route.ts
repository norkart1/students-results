import { NextRequest, NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import dbConnect from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

// GET: List all admins (superadmin only)
export async function GET(req: NextRequest) {
  await dbConnect();
  // TODO: Add authentication and superadmin check
  const admins = await Admin.find({}, '-password');
  return NextResponse.json(admins);
}

// POST: Add new admin (superadmin only)
export async function POST(req: NextRequest) {
  await dbConnect();
  // TODO: Add authentication and superadmin check
  const { username, password, role, sidebarRestrict } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
  }
  const existing = await Admin.findOne({ username });
  if (existing) {
    return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
  }
  const hash = await bcrypt.hash(password, 10);
  const admin = await Admin.create({ username, password: hash, role: role || 'admin', sidebarRestrict: sidebarRestrict !== false });
  return NextResponse.json({ id: admin._id, username: admin.username, role: admin.role, sidebarRestrict: admin.sidebarRestrict });
}
