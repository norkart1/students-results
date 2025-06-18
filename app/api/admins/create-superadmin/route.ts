import { NextRequest, NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import dbConnect from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

// POST: Create or update default superadmin from env
export async function POST() {
  await dbConnect();
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (!username || !password) {
    return NextResponse.json({ error: 'ADMIN_USERNAME and ADMIN_PASSWORD must be set in env' }, { status: 400 });
  }
  let admin = await Admin.findOne({ username });
  const hash = await bcrypt.hash(password, 10);
  if (!admin) {
    admin = await Admin.create({ username, password: hash, role: 'superadmin', sidebarRestrict: true });
  } else {
    admin.role = 'superadmin';
    admin.password = hash;
    admin.sidebarRestrict = true;
    await admin.save();
  }
  return NextResponse.json({ id: admin._id, username: admin.username, role: admin.role, sidebarRestrict: admin.sidebarRestrict });
}
