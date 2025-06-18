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

    // Calculate grand total and percentage using new flexible marks structure
    let grandTotal = 0
    let maxPossibleMarks = 0
    const subjects = (body.subjects || []).map((subjectMark: any) => {
      // Find the computed total key (usually 'T')
      const scoringScheme = subjectMark.subject?.scoringScheme || []
      const totalComp = scoringScheme.find((c: any) => c.computed && (c.key?.toLowerCase() === 't' || c.label?.toLowerCase() === 'total'))
      let total = 0
      let max = 0
      if (totalComp && totalComp.key) {
        // Sum all non-computed fields for total
        total = scoringScheme.filter((c: any) => !c.computed).reduce((acc: number, c: any) => acc + (Number(subjectMark.marks[c.key]) || 0), 0)
        max = scoringScheme.filter((c: any) => !c.computed).reduce((acc: number, c: any) => acc + (Number(c.max) || 0), 0)
        subjectMark.marks[totalComp.key] = total
      } else {
        // Fallback: sum all fields
        total = Object.values(subjectMark.marks).reduce((acc: number, v: any) => acc + (Number(v) || 0), 0)
        max = 100
      }
      grandTotal += total
      maxPossibleMarks += max
      return subjectMark
    })
    const percentage = maxPossibleMarks > 0 ? (grandTotal / maxPossibleMarks) * 100 : 0

    const result = await Result.create({
      ...body,
      subjects,
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
