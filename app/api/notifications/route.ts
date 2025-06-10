import { NextResponse } from "next/server";

// Dummy notifications data (replace with real DB logic)
const notifications = [
  { id: 1, message: "New student registered", read: false },
  { id: 2, message: "Batch results published", read: false },
  { id: 3, message: "System maintenance scheduled", read: false },
];

export async function GET() {
  // Only return unread notifications count for now
  const unreadCount = notifications.filter(n => !n.read).length;
  return NextResponse.json({ count: unreadCount, notifications });
}
