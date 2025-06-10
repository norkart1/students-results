import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Result from "@/models/Result"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const result = await Result.findById(params.id).populate({
      path: "subjects.subject",
      select: "name code"
    })
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }
    // Map subjects to include subject details
    const subjects = (result.subjects || []).map((s: any) => ({
      subject: {
        _id: s.subject?._id,
        name: s.subject?.name,
        code: s.subject?.code,
      },
      writtenMarks: s.writtenMarks,
      ceMarks: s.ceMarks,
      totalMarks: s.totalMarks,
    }))
    return NextResponse.json({
      _id: result._id,
      subjects,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch result" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const body = await request.json()
    const { subjects } = body
    // Update only the subjects array
    const result = await Result.findByIdAndUpdate(
      params.id,
      { subjects },
      { new: true }
    )
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Result updated successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update result" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const result = await Result.findByIdAndDelete(params.id)
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }
    return NextResponse.json({ message: "Result deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete result" }, { status: 500 })
  }
}
