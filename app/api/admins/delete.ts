import { NextRequest, NextResponse } from 'next/server';
import Admin from '@/models/Admin';
import dbConnect from '@/lib/mongodb';

// DELETE: Remove an admin (superadmin only)
export async function DELETE(req: NextRequest) {
  await dbConnect();
  // TODO: Add authentication and superadmin check
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'Admin ID required' }, { status: 400 });
  }
  // Prevent deleting the last superadmin
  const admin = await Admin.findById(id);
  if (!admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  if (admin.role === 'superadmin') {
    const superadmins = await Admin.countDocuments({ role: 'superadmin' });
    if (superadmins <= 1) {
      return NextResponse.json({ error: 'At least one superadmin required' }, { status: 403 });
    }
  }
  await Admin.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
