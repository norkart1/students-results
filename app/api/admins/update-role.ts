import { NextRequest, NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import dbConnect from '@/lib/mongodb';

// PATCH: Update admin role (superadmin only)
export async function PATCH(req: NextRequest) {
  await dbConnect();
  // TODO: Add authentication and superadmin check
  const { id, role, sidebarRestrict } = await req.json();
  if (!id || !role) {
    return NextResponse.json({ error: 'Admin ID and role required' }, { status: 400 });
  }
  if (!['superadmin', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }
  const update: any = { role };
  if (typeof sidebarRestrict !== 'undefined') update.sidebarRestrict = !!sidebarRestrict;
  const admin = await Admin.findByIdAndUpdate(id, update, { new: true });
  if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  return NextResponse.json({ id: admin._id, username: admin.username, role: admin.role, sidebarRestrict: admin.sidebarRestrict });
}
