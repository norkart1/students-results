import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Result from "@/models/Result"

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
