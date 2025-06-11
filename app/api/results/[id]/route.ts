import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Result from "@/models/Result"
import Notification from "@/models/Notification"

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
    const { subjects, grandTotal, percentage } = body
    // If grandTotal/percentage not provided, calculate from subjects
    let computedGrandTotal = grandTotal
    let computedPercentage = percentage
    if (subjects && (grandTotal === undefined || percentage === undefined)) {
      computedGrandTotal = subjects.reduce((sum: number, subj: any) => sum + (subj.totalMarks || 0), 0)
      const maxTotal = subjects.reduce((sum: number, subj: any) => sum + (subj.subject?.maxMarks || 100), 0)
      computedPercentage = maxTotal > 0 ? parseFloat(((computedGrandTotal / maxTotal) * 100).toFixed(2)) : 0
    }
    // Update subjects, grandTotal, and percentage
    const result = await Result.findByIdAndUpdate(
      params.id,
      { subjects, grandTotal: computedGrandTotal, percentage: computedPercentage },
      { new: true }
    )
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }
    // Recalculate ranks for all results in the same batch
    const batchResults = await Result.find({ batch: result.batch })
      .sort({ percentage: -1, grandTotal: -1 })
    for (let i = 0; i < batchResults.length; i++) {
      batchResults[i].rank = i + 1
      await batchResults[i].save()
    }
    // Create notification for result update
    await Notification.create({
      message: `Result updated for student: ${result.student?.name || result.student || "Unknown"}`,
    })
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
