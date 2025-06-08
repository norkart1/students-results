import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Batch from "@/models/Batch"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const batch = await Batch.findById(params.id).populate("subjects")
    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 })
    }
    return NextResponse.json(batch)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch batch" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const body = await request.json()
    const batch = await Batch.findByIdAndUpdate(params.id, body, { new: true })
    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 })
    }
    return NextResponse.json(batch)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update batch" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const batch = await Batch.findByIdAndDelete(params.id)
    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Batch deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete batch" }, { status: 500 })
  }
}
