import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Result from "@/models/Result"
import Notification from "@/models/Notification"

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(request.url)
    const batchId = searchParams.get("batch")

    const query = batchId ? { batch: batchId } : {}
    const results = await Result.find(query)
      .populate("student")
      .populate("batch")
      .populate("subjects.subject")
      .sort({ rank: 1 })

    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()

    // Calculate grand total and percentage
    const grandTotal = body.subjects.reduce((sum: number, subject: any) => sum + subject.totalMarks, 0)
    const maxPossibleMarks = body.subjects.length * 100
    const percentage = (grandTotal / maxPossibleMarks) * 100

    const result = await Result.create({
      ...body,
      grandTotal,
      percentage: Math.round(percentage * 10) / 10,
    })

    // Recalculate ranks for all results in the same batch
    const batchResults = await Result.find({ batch: result.batch })
      .sort({ percentage: -1, grandTotal: -1 })
    for (let i = 0; i < batchResults.length; i++) {
      batchResults[i].rank = i + 1
      await batchResults[i].save()
    }

    // Refetch the created result with the updated rank and populated fields
    const updatedResult = await Result.findById(result._id)
      .populate("student")
      .populate("batch")
      .populate("subjects.subject")

    // Create notification for new result/marks entry
    await Notification.create({
      message: `Result added for student: ${result.student?.name || result.student || "Unknown"}`,
    })

    return NextResponse.json(updatedResult, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create result" }, { status: 500 })
  }
}
