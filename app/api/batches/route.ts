import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Batch from "@/models/Batch"

export async function GET() {
  try {
    await dbConnect()
    const batches = await Batch.find().populate("subjects").sort({ createdAt: -1 })
    return NextResponse.json(batches)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch batches" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const batch = await Batch.create(body)
    return NextResponse.json(batch, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create batch" }, { status: 500 })
  }
}
