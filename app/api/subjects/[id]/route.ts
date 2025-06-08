import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Subject from "@/models/Subject"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const subject = await Subject.findById(params.id)
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }
    return NextResponse.json(subject)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subject" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const body = await request.json()
    const subject = await Subject.findByIdAndUpdate(params.id, body, { new: true })
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }
    return NextResponse.json(subject)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update subject" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const subject = await Subject.findByIdAndDelete(params.id)
    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Subject deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete subject" }, { status: 500 })
  }
}
