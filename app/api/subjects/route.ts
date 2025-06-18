import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Subject from "@/models/Subject"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const url = new URL(request.url)
    const idsParam = url.searchParams.get("ids")
    let subjects
    if (idsParam) {
      const ids = idsParam.split(",")
      subjects = await Subject.find({ _id: { $in: ids } }).sort({ createdAt: -1 })
    } else {
      subjects = await Subject.find().sort({ createdAt: -1 })
    }
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
