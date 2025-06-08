import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Subject from "@/models/Subject"

export async function GET() {
  try {
    await dbConnect()
    const subjects = await Subject.find().sort({ createdAt: -1 })
    return NextResponse.json(subjects)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const subject = await Subject.create(body)
    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 })
  }
}
