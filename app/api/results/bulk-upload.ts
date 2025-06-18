import { NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Result from "@/models/Result"
import Student from "@/models/Student"

export async function POST(req: NextRequest) {
  await dbConnect()
  const { batch, results } = await req.json()
  if (!batch || !Array.isArray(results)) {
    return NextResponse.json({ error: "Missing batch or results" }, { status: 400 })
  }
  let created = 0, updated = 0, errors: any[] = []
  for (const entry of results) {
    try {
      // Find student by regNumber
      const student = await Student.findOne({ regNumber: entry.regNumber })
      if (!student) {
        errors.push({ regNumber: entry.regNumber, error: "Student not found" })
        continue
      }
      // Upsert result for this student/batch
      const existing = await Result.findOne({ student: student._id, batch })
      if (existing) {
        existing.subjects = entry.subjects
        // Recalculate grandTotal and percentage
        existing.grandTotal = entry.subjects.reduce((sum: number, subj: any) => sum + (subj.marks.T || 0), 0)
        const maxTotal = entry.subjects.reduce((sum: number, subj: any) => {
          return sum + Object.keys(subj.marks).filter(k => k !== 'T').reduce((acc, k) => acc + (Number(subj.marks[k]) || 0), 0)
        }, 0)
        existing.percentage = maxTotal > 0 ? parseFloat(((existing.grandTotal / maxTotal) * 100).toFixed(2)) : 0
        await existing.save()
        updated++
      } else {
        const grandTotal = entry.subjects.reduce((sum: number, subj: any) => sum + (subj.marks.T || 0), 0)
        const maxTotal = entry.subjects.reduce((sum: number, subj: any) => {
          return sum + Object.keys(subj.marks).filter(k => k !== 'T').reduce((acc, k) => acc + (Number(subj.marks[k]) || 0), 0)
        }, 0)
        const percentage = maxTotal > 0 ? parseFloat(((grandTotal / maxTotal) * 100).toFixed(2)) : 0
        await Result.create({
          student: student._id,
          batch,
          subjects: entry.subjects,
          grandTotal,
          percentage
        })
        created++
      }
    } catch (err: any) {
      errors.push({ regNumber: entry.regNumber, error: err.message })
    }
  }
  return NextResponse.json({ created, updated, errors })
}
