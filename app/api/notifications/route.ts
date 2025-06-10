import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function GET() {
  await dbConnect();
  const notifications = await Notification.find().sort({ createdAt: -1 }).lean();
  const unreadCount = notifications.filter((n: any) => !n.read).length;
  return NextResponse.json({ count: unreadCount, notifications });
}
